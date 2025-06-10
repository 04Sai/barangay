const express = require('express');
const Announcement = require('../models/Announcement');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const { category, isActive, limit, page } = req.query;
        
        // Build filter object
        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 50;
        const skip = (pageNumber - 1) * pageSize;

        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        const total = await Announcement.countDocuments(filter);

        res.json({
            success: true,
            data: announcements,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: announcements.length,
                totalItems: total
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
        const { title, content, category, date, source, isActive } = req.body;

        const announcement = new Announcement({
            title,
            content,
            category,
            date: date || new Date(),
            source: source || 'Admin',
            isActive: isActive !== undefined ? isActive : true,
            // createdBy: req.user?._id // Optional for now
        });

        await announcement.save();

        // Populate the created announcement
        await announcement.populate('createdBy', 'firstName lastName email');

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
        const { title, content, category, date, source, isActive } = req.body;

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category,
                date,
                source,
                isActive,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email');

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
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error', 
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
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
            message: 'Announcement deleted successfully',
            data: announcement
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
