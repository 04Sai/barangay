const express = require('express');
const Appointment = require('../models/Appointment');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all appointments with advanced filtering
router.get('/', async (req, res) => {
    try {
        const { 
            status, 
            type, 
            priority,
            department,
            isUrgent,
            dateFrom,
            dateTo,
            search, 
            limit, 
            page,
            sortBy,
            sortOrder 
        } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (status && status !== 'All') {
            if (status.includes(',')) {
                filter.status = { $in: status.split(',') };
            } else {
                filter.status = status;
            }
        }
        if (type && type !== 'All') {
            filter.type = type;
        }
        if (priority && priority !== 'All') {
            filter.priority = priority;
        }
        if (department && department !== 'All') {
            filter['assignedTo.department'] = department;
        }
        if (isUrgent !== undefined) {
            filter.isUrgent = isUrgent === 'true';
        }

        // Date range filter
        if (dateFrom || dateTo) {
            filter['dateTime.scheduled'] = {};
            if (dateFrom) {
                filter['dateTime.scheduled'].$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter['dateTime.scheduled'].$lte = new Date(dateTo + 'T23:59:59.999Z');
            }
        }

        // Text search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'appointee.name': { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 25;
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'dateTime.scheduled';
        const sortDirection = sortOrder === 'desc' ? -1 : 1;
        sort[sortField] = sortDirection;

        const appointments = await Appointment.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const total = await Appointment.countDocuments(filter);

        // Get aggregated statistics
        const statusStats = await Appointment.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const typeStats = await Appointment.aggregate([
            { $match: filter },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const departmentStats = await Appointment.aggregate([
            { $match: filter },
            { $group: { _id: '$assignedTo.department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: appointments,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: appointments.length,
                totalItems: total
            },
            statistics: {
                status: statusStats,
                types: typeStats,
                departments: departmentStats
            },
            filters: {
                status,
                type,
                priority,
                department,
                isUrgent,
                search,
                dateFrom,
                dateTo
            }
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch appointments', 
            error: error.message 
        });
    }
});

// Get upcoming appointments (next 7 days)
router.get('/upcoming', async (req, res) => {
    try {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingAppointments = await Appointment.find({
            'dateTime.scheduled': { $gte: now, $lte: nextWeek },
            status: { $nin: ['Cancelled', 'Completed'] }
        }).sort({ 'dateTime.scheduled': 1 }).limit(20);

        res.json({
            success: true,
            data: upcomingAppointments,
            count: upcomingAppointments.length
        });
    } catch (error) {
        console.error('Get upcoming appointments error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch upcoming appointments', 
            error: error.message 
        });
    }
});

// Get single appointment
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email');
        
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch appointment', 
            error: error.message 
        });
    }
});

// Create new appointment
router.post('/', async (req, res) => {
    try {
        const appointmentData = req.body;

        const appointment = new Appointment({
            ...appointmentData,
            history: [{
                action: 'Created',
                details: 'Appointment created',
                timestamp: new Date()
            }]
        });

        await appointment.save();
        await appointment.populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create appointment', 
            error: error.message 
        });
    }
});

// Update appointment
router.put('/:id', async (req, res) => {
    try {
        const appointmentData = req.body;
        const currentAppointment = await Appointment.findById(req.params.id);

        if (!currentAppointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        // Track status changes
        const statusChanged = currentAppointment.status !== appointmentData.status;
        const updateData = {
            ...appointmentData,
            updatedAt: new Date()
        };

        // Add history entry if status changed
        if (statusChanged) {
            updateData.$push = {
                history: {
                    action: 'Updated',
                    details: `Status changed from ${currentAppointment.status} to ${appointmentData.status}`,
                    timestamp: new Date(),
                    previousValues: { status: currentAppointment.status }
                }
            };
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email')
         .populate('lastModifiedBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update appointment', 
            error: error.message 
        });
    }
});

// Bulk update status
router.put('/status/bulk', async (req, res) => {
    try {
        const { appointmentIds, status, assignedTo } = req.body;

        const updateData = { 
            status, 
            updatedAt: new Date()
        };

        if (assignedTo) {
            updateData.assignedTo = assignedTo;
        }

        const result = await Appointment.updateMany(
            { _id: { $in: appointmentIds } },
            {
                ...updateData,
                $push: {
                    history: {
                        action: 'Updated',
                        details: `Bulk status update to ${status}`,
                        timestamp: new Date()
                    }
                }
            }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} appointments updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update appointments', 
            error: error.message 
        });
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete appointment', 
            error: error.message 
        });
    }
});

// Get statistics and analytics
router.get('/stats/overview', async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        
        // Date filter for stats
        const dateFilter = {};
        if (dateFrom || dateTo) {
            dateFilter['dateTime.scheduled'] = {};
            if (dateFrom) dateFilter['dateTime.scheduled'].$gte = new Date(dateFrom);
            if (dateTo) dateFilter['dateTime.scheduled'].$lte = new Date(dateTo + 'T23:59:59.999Z');
        }

        // Overall statistics
        const totalAppointments = await Appointment.countDocuments(dateFilter);
        const pendingAppointments = await Appointment.countDocuments({ ...dateFilter, status: 'Pending' });
        const confirmedAppointments = await Appointment.countDocuments({ ...dateFilter, status: 'Confirmed' });
        const completedAppointments = await Appointment.countDocuments({ ...dateFilter, status: 'Completed' });
        const cancelledAppointments = await Appointment.countDocuments({ ...dateFilter, status: 'Cancelled' });
        const urgentAppointments = await Appointment.countDocuments({ ...dateFilter, isUrgent: true });

        // Completion rate
        const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

        // Trend data (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trendData = await Appointment.aggregate([
            {
                $match: {
                    'dateTime.scheduled': { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$dateTime.scheduled' },
                        month: { $month: '$dateTime.scheduled' },
                        day: { $dayOfMonth: '$dateTime.scheduled' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    total: totalAppointments,
                    pending: pendingAppointments,
                    confirmed: confirmedAppointments,
                    completed: completedAppointments,
                    cancelled: cancelledAppointments,
                    urgent: urgentAppointments,
                    completionRate: completionRate
                },
                trends: trendData
            }
        });
    } catch (error) {
        console.error('Get appointment stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch statistics', 
            error: error.message 
        });
    }
});

module.exports = router;
