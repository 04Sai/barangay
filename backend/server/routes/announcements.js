const express = require('express');
const Announcement = require('../models/Announcement');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            isActive, 
            limit, 
            page,
            sortBy,
            sortOrder 
        } = req.query;
        
        const filter = {};
        
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const pageNumber = parseInt(page) || 1;
        const pageSize = Math.min(parseInt(limit) || 25, 100);
        const skip = (pageNumber - 1) * pageSize;

        const sort = {};
        const sortField = sortBy || 'createdAt';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = sortDirection;

        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await Announcement.countDocuments(filter);

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
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch announcements', 
            error: error.message 
        });
    }
});

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
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch announcement', 
            error: error.message 
        });
    }
});

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
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update announcement', 
            error: error.message 
        });
    }
});

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
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete announcement', 
            error: error.message 
        });
    }
});

module.exports = router;