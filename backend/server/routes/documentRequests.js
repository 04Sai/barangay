const express = require('express');
const DocumentRequest = require('../models/DocumentRequest');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all document requests with filtering
router.get('/', async (req, res) => {
    try {
        const {
            status,
            priority,
            documentType,
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
            filter.status = status;
        }
        if (priority && priority !== 'All') {
            filter.priority = priority;
        }
        if (documentType && documentType !== 'All') {
            filter['documentTypes.type'] = documentType;
        }

        // Date range filter
        if (dateFrom || dateTo) {
            filter['appointment.preferredDate'] = {};
            if (dateFrom) {
                filter['appointment.preferredDate'].$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter['appointment.preferredDate'].$lte = new Date(dateTo + 'T23:59:59.999Z');
            }
        }

        // Text search
        if (search && search.trim()) {
            filter.$or = [
                { requestId: { $regex: search.trim(), $options: 'i' } },
                { 'requestor.name': { $regex: search.trim(), $options: 'i' } },
                { 'requestor.contactNumber': { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 25;
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'createdAt';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;

        const requests = await DocumentRequest.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const total = await DocumentRequest.countDocuments(filter);

        // Get statistics
        const statusStats = await DocumentRequest.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: requests,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: requests.length,
                totalItems: total
            },
            statistics: {
                status: statusStats
            }
        });
    } catch (error) {
        console.error('Get document requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch document requests',
            error: error.message
        });
    }
});

// Get single document request
router.get('/:id', async (req, res) => {
    try {
        const request = await DocumentRequest.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Get document request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch document request',
            error: error.message
        });
    }
});

// Create new document request
router.post('/', async (req, res) => {
    try {
        console.log('Received document request data:', JSON.stringify(req.body, null, 2));
        
        const requestData = req.body;

        // Validate required fields
        if (!requestData.documentTypes || requestData.documentTypes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one document type is required'
            });
        }

        if (!requestData.requestor || !requestData.requestor.name) {
            return res.status(400).json({
                success: false,
                message: 'Requestor information is required'
            });
        }

        // Create document request (requestId will be auto-generated)
        const documentRequest = new DocumentRequest({
            ...requestData,
            status: requestData.status || 'Pending Review',
            submittedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Creating document request with data:', JSON.stringify(documentRequest.toObject(), null, 2));

        await documentRequest.save();

        console.log('Document request saved successfully:', documentRequest.requestId);

        res.status(201).json({
            success: true,
            message: 'Document request submitted successfully',
            data: {
                requestId: documentRequest.requestId,
                ...documentRequest.toObject()
            }
        });
    } catch (error) {
        console.error('Create document request error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create document request',
            error: error.message
        });
    }
});

// Update document request
router.put('/:id', async (req, res) => {
    try {
        const updateData = req.body;
        const currentRequest = await DocumentRequest.findById(req.params.id);

        if (!currentRequest) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        // Track status changes
        if (updateData.status && currentRequest.status !== updateData.status) {
            updateData.$push = {
                history: {
                    action: 'Status Updated',
                    details: `Status changed from ${currentRequest.status} to ${updateData.status}`,
                    performedBy: 'Admin',
                    previousStatus: currentRequest.status,
                    timestamp: new Date()
                }
            };
        }

        const request = await DocumentRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Document request updated successfully',
            data: request
        });
    } catch (error) {
        console.error('Update document request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update document request',
            error: error.message
        });
    }
});

// Delete document request
router.delete('/:id', async (req, res) => {
    try {
        const request = await DocumentRequest.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Document request not found'
            });
        }

        res.json({
            success: true,
            message: 'Document request deleted successfully'
        });
    } catch (error) {
        console.error('Delete document request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete document request',
            error: error.message
        });
    }
});

module.exports = router;
