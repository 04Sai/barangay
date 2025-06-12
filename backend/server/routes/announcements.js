const express = require('express');
const Announcement = require('../models/Announcement');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all announcements with filtering
router.get('/', async (req, res) => {
    try {
        console.log('Received announcements request with query:', req.query);
        
        const { 
            category, 
            isActive, 
            limit, 
            page,
            sortBy,
            sortOrder 
        } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        console.log('Applied filter:', JSON.stringify(filter, null, 2));

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = Math.min(parseInt(limit) || 25, 100);
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'createdAt';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;

        // Execute the query
        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await Announcement.countDocuments(filter);

        console.log(`Found ${announcements.length} announcements out of ${total} total`);

        res.json({
            success: true,
            data: announcements,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: announcements.length,
                totalItems: total
            },
            filters: {
                category,
                isActive
            }
        });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch announcements', 
            error: error.message 
        });
    }
});

// Get single announcement
router.get('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email');
        
        if (!announcement) {
            return res.status(404).json({ 
                success: false, 
                message: 'Announcement not found' 
            });
        }

        res.json({
            success: true,
            data: announcement
        });
    } catch (error) {
        console.error('Get announcement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch announcement', 
            error: error.message 
        });
    }
});

// Create new announcement
router.post('/', async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create announcement', 
            error: error.message 
        });
    }
});

// Update announcement
router.put('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!announcement) {
            return res.status(404).json({ 
                success: false, 
                message: 'Announcement not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement
        });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update announcement', 
            error: error.message 
        });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ 
                success: false, 
                message: 'Announcement not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete announcement', 
            error: error.message 
        });
    }
});

module.exports = router;