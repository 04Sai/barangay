const express = require('express');
const Hotline = require('../models/Hotline');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all hotlines with advanced filtering
router.get('/', async (req, res) => {
    try {
        const {
            category,
            priority,
            availability,
            isActive,
            isVerified,
            search,
            limit,
            page,
            sortBy,
            sortOrder
        } = req.query;

        console.log('Hotlines query params:', req.query); // Debug log

        // Build filter object
        const filter = {};

        // Only apply filters if they have meaningful values
        if (category && category !== 'All' && category !== '') {
            filter.category = category;
        }
        if (priority && priority !== 'All' && priority !== '') {
            filter.priority = priority;
        }
        if (availability && availability !== 'All' && availability !== '') {
            filter.availability = availability;
        }

        // Handle boolean filters more carefully
        if (isActive !== undefined && isActive !== '' && isActive !== 'All') {
            filter.isActive = isActive === 'true';
        }
        if (isVerified !== undefined && isVerified !== '' && isVerified !== 'All') {
            filter.isVerified = isVerified === 'true';
        }

        // Text search
        if (search && search.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { tags: { $in: [new RegExp(search.trim(), 'i')] } }
            ];
        }

        console.log('Applied filter:', filter); // Debug log

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 50;
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        let sortOptions = {};
        const sortField = sortBy || 'createdAt';
        const sortDirection = sortOrder === 'desc' ? -1 : 1;

        if (sortField === 'priority') {
            // Custom sort for priority: Critical, High, Medium, Low
            sortOptions = {
                priority: 1, // This will sort alphabetically, but we'll handle priority custom sorting
                name: 1
            };
        } else {
            sortOptions[sortField] = sortDirection;
        }

        const hotlines = await Hotline.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotline.countDocuments(filter);

        console.log(`Found ${hotlines.length} hotlines out of ${total} total`); // Debug log

        // Group by category for enhanced response
        const categories = await Hotline.aggregate([
            { $match: filter },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: hotlines,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: hotlines.length,
                totalItems: total
            },
            categories: categories,
            filters: {
                category,
                priority,
                availability,
                isActive,
                isVerified,
                search
            }
        });
    } catch (error) {
        console.error('Get hotlines error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hotlines',
            error: error.message
        });
    }
});

// Get emergency hotlines (quick access)
router.get('/emergency', async (req, res) => {
    try {
        const emergencyHotlines = await Hotline.find({
            $or: [
                { category: 'Emergency' },
                { priority: 'Critical' },
                { category: 'Police & Security' },
                { category: 'Fire Department' },
                { category: 'Medical Emergency' }
            ],
            isActive: true,
            isVerified: true
        }).sort({ priority: 1, name: 1 }).limit(20);

        res.json({
            success: true,
            data: emergencyHotlines,
            count: emergencyHotlines.length
        });
    } catch (error) {
        console.error('Get emergency hotlines error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch emergency hotlines',
            error: error.message
        });
    }
});

// Get single hotline
router.get('/:id', async (req, res) => {
    try {
        const hotline = await Hotline.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email');

        if (!hotline) {
            return res.status(404).json({
                success: false,
                message: 'Hotline not found'
            });
        }

        res.json({
            success: true,
            data: hotline
        });
    } catch (error) {
        console.error('Get hotline error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hotline',
            error: error.message
        });
    }
});

// Create new hotline
router.post('/', async (req, res) => {
    try {
        const hotlineData = req.body;

        // Auto-generate tags based on name and description
        const autoTags = [];
        if (hotlineData.name) {
            autoTags.push(...hotlineData.name.toLowerCase().split(' ').filter(word => word.length > 2));
        }
        if (hotlineData.description) {
            autoTags.push(...hotlineData.description.toLowerCase().split(' ').filter(word => word.length > 3));
        }

        const hotline = new Hotline({
            ...hotlineData,
            tags: [...(hotlineData.tags || []), ...autoTags].filter((tag, index, self) => self.indexOf(tag) === index),
            lastVerified: new Date()
        });

        await hotline.save();
        await hotline.populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Hotline created successfully',
            data: hotline
        });
    } catch (error) {
        console.error('Create hotline error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create hotline',
            error: error.message
        });
    }
});

// Update hotline
router.put('/:id', async (req, res) => {
    try {
        const hotlineData = req.body;

        const hotline = await Hotline.findByIdAndUpdate(
            req.params.id,
            {
                ...hotlineData,
                updatedAt: new Date(),
                lastVerified: new Date()
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email');

        if (!hotline) {
            return res.status(404).json({
                success: false,
                message: 'Hotline not found'
            });
        }

        res.json({
            success: true,
            message: 'Hotline updated successfully',
            data: hotline
        });
    } catch (error) {
        console.error('Update hotline error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update hotline',
            error: error.message
        });
    }
});

// Bulk update verification status
router.put('/verify/bulk', async (req, res) => {
    try {
        const { hotlineIds, isVerified } = req.body;

        const result = await Hotline.updateMany(
            { _id: { $in: hotlineIds } },
            {
                isVerified,
                lastVerified: new Date(),
                updatedAt: new Date()
            }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} hotlines verification status updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk verify hotlines error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update verification status',
            error: error.message
        });
    }
});

// Delete hotline
router.delete('/:id', async (req, res) => {
    try {
        const hotline = await Hotline.findByIdAndDelete(req.params.id);

        if (!hotline) {
            return res.status(404).json({
                success: false,
                message: 'Hotline not found'
            });
        }

        res.json({
            success: true,
            message: 'Hotline deleted successfully',
            data: hotline
        });
    } catch (error) {
        console.error('Delete hotline error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete hotline',
            error: error.message
        });
    }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await Hotline.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: { $sum: { $cond: ['$isActive', 1, 0] } },
                    verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
                    critical: { $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] } },
                    emergency: { $sum: { $cond: [{ $eq: ['$category', 'Emergency'] }, 1, 0] } }
                }
            }
        ]);

        const categoryStats = await Hotline.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const priorityStats = await Hotline.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats[0] || { total: 0, active: 0, verified: 0, critical: 0, emergency: 0 },
                categories: categoryStats,
                priorities: priorityStats
            }
        });
    } catch (error) {
        console.error('Get hotlines stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

module.exports = router;
