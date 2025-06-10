const express = require('express');
const IncidentReport = require('../models/IncidentReport');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all incident reports with advanced filtering
router.get('/', async (req, res) => {
    try {
        const { 
            status, 
            severity, 
            priority,
            incidentTypes,
            assignedDepartment,
            isEmergency,
            search, 
            dateFrom,
            dateTo,
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
        if (severity && severity !== 'All') {
            filter.severity = severity;
        }
        if (priority && priority !== 'All') {
            filter.priority = priority;
        }
        if (incidentTypes && incidentTypes !== 'All') {
            filter.incidentTypes = { $in: [incidentTypes] };
        }
        if (assignedDepartment && assignedDepartment !== 'All') {
            filter['assignedTo.department'] = assignedDepartment;
        }
        if (isEmergency !== undefined) {
            filter.isEmergency = isEmergency === 'true';
        }

        // Date range filter
        if (dateFrom || dateTo) {
            filter['dateTime.occurred'] = {};
            if (dateFrom) {
                filter['dateTime.occurred'].$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter['dateTime.occurred'].$lte = new Date(dateTo + 'T23:59:59.999Z');
            }
        }

        // Text search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } },
                { 'reporter.name': { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 25;
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'dateTime.occurred';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;

        const incidentReports = await IncidentReport.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email')
            .populate('relatedIncidents', 'title status')
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const total = await IncidentReport.countDocuments(filter);

        // Get aggregated statistics
        const statusStats = await IncidentReport.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const severityStats = await IncidentReport.aggregate([
            { $match: filter },
            { $group: { _id: '$severity', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const typeStats = await IncidentReport.aggregate([
            { $match: filter },
            { $unwind: '$incidentTypes' },
            { $group: { _id: '$incidentTypes', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: incidentReports,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: incidentReports.length,
                totalItems: total
            },
            statistics: {
                status: statusStats,
                severity: severityStats,
                types: typeStats
            },
            filters: {
                status,
                severity,
                priority,
                incidentTypes,
                assignedDepartment,
                isEmergency,
                search,
                dateFrom,
                dateTo
            }
        });
    } catch (error) {
        console.error('Get incident reports error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch incident reports', 
            error: error.message 
        });
    }
});

// Get emergency incident reports
router.get('/emergency', async (req, res) => {
    try {
        const emergencyReports = await IncidentReport.find({
            $or: [
                { isEmergency: true },
                { severity: 'Critical' },
                { priority: 'Urgent' },
                { incidentTypes: { $in: ['Medical Emergency', 'Fire', 'Crime'] } }
            ],
            status: { $nin: ['Resolved', 'Closed'] }
        }).sort({ 'dateTime.occurred': -1 }).limit(20);

        res.json({
            success: true,
            data: emergencyReports,
            count: emergencyReports.length
        });
    } catch (error) {
        console.error('Get emergency reports error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch emergency reports', 
            error: error.message 
        });
    }
});

// Get single incident report
router.get('/:id', async (req, res) => {
    try {
        const incidentReport = await IncidentReport.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email')
            .populate('relatedIncidents', 'title status dateTime.occurred');
        
        if (!incidentReport) {
            return res.status(404).json({ 
                success: false, 
                message: 'Incident report not found' 
            });
        }

        res.json({
            success: true,
            data: incidentReport
        });
    } catch (error) {
        console.error('Get incident report error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch incident report', 
            error: error.message 
        });
    }
});

// Create new incident report
router.post('/', async (req, res) => {
    try {
        const incidentData = req.body;

        const incidentReport = new IncidentReport({
            ...incidentData,
            dateTime: {
                occurred: new Date(incidentData.dateTime?.occurred || Date.now()),
                reported: new Date()
            }
        });

        await incidentReport.save();
        await incidentReport.populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Incident report created successfully',
            data: incidentReport
        });
    } catch (error) {
        console.error('Create incident report error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create incident report', 
            error: error.message 
        });
    }
});

// Update incident report
router.put('/:id', async (req, res) => {
    try {
        const incidentData = req.body;
        const currentReport = await IncidentReport.findById(req.params.id);

        if (!currentReport) {
            return res.status(404).json({ 
                success: false, 
                message: 'Incident report not found' 
            });
        }

        // Track status changes
        const statusChanged = currentReport.status !== incidentData.status;
        const updateData = {
            ...incidentData,
            updatedAt: new Date()
        };

        // Add update log if status changed
        if (statusChanged) {
            updateData.$push = {
                updates: {
                    message: `Status changed from ${currentReport.status} to ${incidentData.status}`,
                    updateDate: new Date(),
                    statusChange: {
                        from: currentReport.status,
                        to: incidentData.status
                    }
                }
            };
        }

        const incidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email')
         .populate('lastModifiedBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Incident report updated successfully',
            data: incidentReport
        });
    } catch (error) {
        console.error('Update incident report error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update incident report', 
            error: error.message 
        });
    }
});

// Bulk update status
router.put('/status/bulk', async (req, res) => {
    try {
        const { reportIds, status, assignedTo } = req.body;

        const updateData = { 
            status, 
            updatedAt: new Date()
        };

        if (assignedTo) {
            updateData.assignedTo = assignedTo;
        }

        const result = await IncidentReport.updateMany(
            { _id: { $in: reportIds } },
            {
                ...updateData,
                $push: {
                    updates: {
                        message: `Bulk status update to ${status}`,
                        updateDate: new Date()
                    }
                }
            }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} incident reports updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update incident reports', 
            error: error.message 
        });
    }
});

// Delete incident report
router.delete('/:id', async (req, res) => {
    try {
        const incidentReport = await IncidentReport.findByIdAndDelete(req.params.id);

        if (!incidentReport) {
            return res.status(404).json({ 
                success: false, 
                message: 'Incident report not found' 
            });
        }

        res.json({
            success: true,
            message: 'Incident report deleted successfully',
            data: incidentReport
        });
    } catch (error) {
        console.error('Delete incident report error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete incident report', 
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
            dateFilter['dateTime.occurred'] = {};
            if (dateFrom) dateFilter['dateTime.occurred'].$gte = new Date(dateFrom);
            if (dateTo) dateFilter['dateTime.occurred'].$lte = new Date(dateTo + 'T23:59:59.999Z');
        }

        // Overall statistics
        const totalReports = await IncidentReport.countDocuments(dateFilter);
        const pendingReports = await IncidentReport.countDocuments({ ...dateFilter, status: 'Pending' });
        const resolvedReports = await IncidentReport.countDocuments({ ...dateFilter, status: 'Resolved' });
        const emergencyReports = await IncidentReport.countDocuments({ ...dateFilter, isEmergency: true });
        const criticalReports = await IncidentReport.countDocuments({ ...dateFilter, severity: 'Critical' });

        // Trend data (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trendData = await IncidentReport.aggregate([
            {
                $match: {
                    'dateTime.occurred': { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$dateTime.occurred' },
                        month: { $month: '$dateTime.occurred' },
                        day: { $dayOfMonth: '$dateTime.occurred' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Response time analytics
        const responseTimeStats = await IncidentReport.aggregate([
            {
                $match: {
                    ...dateFilter,
                    status: { $nin: ['Pending'] },
                    updates: { $exists: true, $ne: [] }
                }
            },
            {
                $project: {
                    responseTime: {
                        $divide: [
                            { $subtract: [{ $arrayElemAt: ['$updates.updateDate', 0] }, '$dateTime.reported'] },
                            1000 * 60 * 60 // Convert to hours
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgResponseTime: { $avg: '$responseTime' },
                    minResponseTime: { $min: '$responseTime' },
                    maxResponseTime: { $max: '$responseTime' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    total: totalReports,
                    pending: pendingReports,
                    resolved: resolvedReports,
                    emergency: emergencyReports,
                    critical: criticalReports,
                    resolutionRate: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0
                },
                trends: trendData,
                responseTime: responseTimeStats[0] || { avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0 }
            }
        });
    } catch (error) {
        console.error('Get incident stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch statistics', 
            error: error.message 
        });
    }
});

module.exports = router;
