const express = require('express');
const IncidentReport = require('../models/IncidentReport');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all incident reports with advanced filtering
router.get('/', async (req, res) => {
    try {
        console.log('Received incident reports request with query:', req.query);
        
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
        
        // Build filter object safely
        const filter = {};
        
        // Handle status filter
        if (status && status !== 'All' && status !== 'undefined') {
            if (status.includes(',')) {
                filter.status = { $in: status.split(',') };
            } else {
                filter.status = status;
            }
        }
        
        // Handle severity filter
        if (severity && severity !== 'All' && severity !== 'undefined') {
            filter.severity = severity;
        }
        
        // Handle priority filter
        if (priority && priority !== 'All' && priority !== 'undefined') {
            filter.priority = priority;
        }
        
        // Handle incident types filter
        if (incidentTypes && incidentTypes !== 'All' && incidentTypes !== 'undefined') {
            filter.incidentTypes = { $in: [incidentTypes] };
        }
        
        // Handle assigned department filter
        if (assignedDepartment && assignedDepartment !== 'All' && assignedDepartment !== 'undefined') {
            filter['assignedTo.department'] = assignedDepartment;
        }
        
        // Handle emergency filter
        if (isEmergency !== undefined && isEmergency !== 'undefined') {
            filter.isEmergency = isEmergency === 'true';
        }

        // Handle date range filter
        if (dateFrom || dateTo) {
            filter['dateTime.occurred'] = {};
            if (dateFrom && dateFrom !== 'undefined') {
                filter['dateTime.occurred'].$gte = new Date(dateFrom);
            }
            if (dateTo && dateTo !== 'undefined') {
                filter['dateTime.occurred'].$lte = new Date(dateTo + 'T23:59:59.999Z');
            }
        }

        // Handle text search
        if (search && search !== 'undefined' && search.trim() !== '') {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } },
                { 'reporter.name': { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        console.log('Applied filter:', JSON.stringify(filter, null, 2));

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = Math.min(parseInt(limit) || 25, 100); // Cap at 100 items
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'dateTime.occurred';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;

        console.log('Executing query with pagination:', { skip, limit: pageSize, sort });

        // Execute the query
        const incidentReports = await IncidentReport.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean(); // Use lean() for better performance

        const total = await IncidentReport.countDocuments(filter);

        console.log(`Found ${incidentReports.length} incident reports out of ${total} total`);

        // Get aggregated statistics (only if needed)
        const includeStats = req.query.includeStats === 'true';
        let statistics = null;

        if (includeStats) {
            try {
                const [statusStats, severityStats, typeStats] = await Promise.all([
                    IncidentReport.aggregate([
                        { $match: filter },
                        { $group: { _id: '$status', count: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ]),
                    IncidentReport.aggregate([
                        { $match: filter },
                        { $group: { _id: '$severity', count: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ]),
                    IncidentReport.aggregate([
                        { $match: filter },
                        { $unwind: '$incidentTypes' },
                        { $group: { _id: '$incidentTypes', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ])
                ]);

                statistics = {
                    status: statusStats,
                    severity: severityStats,
                    types: typeStats
                };
            } catch (statsError) {
                console.error('Error generating statistics:', statsError);
                // Continue without statistics
            }
        }

        res.json({
            success: true,
            data: incidentReports,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: incidentReports.length,
                totalItems: total,
                hasNext: pageNumber < Math.ceil(total / pageSize),
                hasPrev: pageNumber > 1
            },
            ...(statistics && { statistics }),
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
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch incident reports', 
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && { 
                stack: error.stack,
                query: req.query 
            })
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

// Get a specific incident report by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Fetching incident report by ID:', id);
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid incident report ID format'
            });
        }

        const incidentReport = await IncidentReport.findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('lastModifiedBy', 'firstName lastName email')
            .lean();

        if (!incidentReport) {
            return res.status(404).json({
                success: false,
                message: 'Incident report not found'
            });
        }

        console.log('Found incident report:', incidentReport.title);

        res.json({
            success: true,
            data: incidentReport
        });
    } catch (error) {
        console.error('Get incident report by ID error:', error);
        
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
        console.log('Received incident report data:', JSON.stringify(req.body, null, 2));
        
        const incidentData = req.body;

        // Validate required fields
        if (!incidentData.title || !incidentData.description || !incidentData.incidentTypes || incidentData.incidentTypes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, and incidentTypes are required'
            });
        }

        // Transform coordinates structure if needed
        const transformedData = { ...incidentData };
        if (incidentData.location && incidentData.location.coordinates) {
            transformedData.location = {
                ...incidentData.location,
                latitude: incidentData.location.coordinates.latitude,
                longitude: incidentData.location.coordinates.longitude
            };
            // Remove the old coordinates object to avoid conflicts
            delete transformedData.location.coordinates;
        }

        const incidentReport = new IncidentReport({
            ...transformedData,
            dateTime: {
                occurred: new Date(transformedData.dateTime?.occurred || Date.now()),
                reported: new Date()
            },
            status: transformedData.status || 'Pending'
        });

        console.log('Creating incident report with transformed data:', JSON.stringify(incidentReport.toObject(), null, 2));

        await incidentReport.save();
        
        // Populate references if needed
        await incidentReport.populate('createdBy', 'firstName lastName email');

        console.log('Incident report saved successfully:', incidentReport._id);

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
                errors: Object.values(error.errors).map(e => e.message),
                details: error.errors
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
        const { id } = req.params;
        const updateData = req.body;
        
        console.log('Updating incident report:', id, updateData);
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid incident report ID format'
            });
        }

        // Add update timestamp
        updateData.updatedAt = new Date();
        updateData['dateTime.lastModified'] = new Date();

        // If status is being updated, add to updates array
        if (updateData.status) {
            const currentReport = await IncidentReport.findById(id);
            if (currentReport && currentReport.status !== updateData.status) {
                const statusUpdate = {
                    message: `Status changed from ${currentReport.status} to ${updateData.status}`,
                    updateDate: new Date(),
                    updatedBy: 'Admin', // You can update this with actual user info
                    statusChange: {
                        from: currentReport.status,
                        to: updateData.status
                    }
                };
                
                updateData.$push = { updates: statusUpdate };
            }
        }

        const incidentReport = await IncidentReport.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email')
         .populate('lastModifiedBy', 'firstName lastName email');

        if (!incidentReport) {
            return res.status(404).json({
                success: false,
                message: 'Incident report not found'
            });
        }

        console.log('Updated incident report:', incidentReport.title);

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

// Delete incident report
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Deleting incident report:', id);
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid incident report ID format'
            });
        }

        const incidentReport = await IncidentReport.findByIdAndDelete(id);

        if (!incidentReport) {
            return res.status(404).json({
                success: false,
                message: 'Incident report not found'
            });
        }

        console.log('Deleted incident report:', incidentReport.title);

        res.json({
            success: true,
            message: 'Incident report deleted successfully',
            data: { id }
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
