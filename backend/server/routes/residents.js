const express = require('express');
const Resident = require('../models/Resident');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all residents with advanced filtering
router.get('/', async (req, res) => {
    try {
        const {
            gender,
            ageMin,
            ageMax,
            search,
            sortBy,
            sortOrder,
            limit,
            page
        } = req.query;

        // Build filter object
        const filter = {};

        if (gender && gender !== 'All') {
            filter.gender = gender;
        }

        // Age filtering requires date calculation
        if (ageMin || ageMax) {
            filter.birthdate = {};

            if (ageMax) {
                // People younger than ageMax
                const minDate = new Date();
                minDate.setFullYear(minDate.getFullYear() - parseInt(ageMax) - 1);
                filter.birthdate.$gt = minDate;
            }

            if (ageMin) {
                // People older than ageMin
                const maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() - parseInt(ageMin));
                filter.birthdate.$lte = maxDate;
            }
        }

        // Text search
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { middleName: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 20;
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        const sortField = sortBy || 'lastName';
        const sortDirection = sortOrder === 'desc' ? -1 : 1;
        sort[sortField] = sortDirection;

        const residents = await Resident.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const total = await Resident.countDocuments(filter);

        res.json({
            success: true,
            data: residents,
            pagination: {
                current: pageNumber,
                total: Math.ceil(total / pageSize),
                count: residents.length,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Get residents error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch residents',
            error: error.message
        });
    }
});

// Get single resident
router.get('/:id', async (req, res) => {
    try {
        const resident = await Resident.findById(req.params.id);

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: 'Resident not found'
            });
        }

        res.json({
            success: true,
            data: resident
        });
    } catch (error) {
        console.error('Get resident error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resident',
            error: error.message
        });
    }
});

// Create new resident
router.post('/', async (req, res) => {
    try {
        const residentData = req.body;
        const resident = new Resident(residentData);
        await resident.save();

        res.status(201).json({
            success: true,
            message: 'Resident created successfully',
            data: resident
        });
    } catch (error) {
        console.error('Create resident error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create resident',
            error: error.message
        });
    }
});

// Update resident
router.put('/:id', async (req, res) => {
    try {
        const residentData = req.body;
        const resident = await Resident.findByIdAndUpdate(
            req.params.id,
            residentData,
            { new: true, runValidators: true }
        );

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: 'Resident not found'
            });
        }

        res.json({
            success: true,
            message: 'Resident updated successfully',
            data: resident
        });
    } catch (error) {
        console.error('Update resident error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update resident',
            error: error.message
        });
    }
});

// Delete resident
router.delete('/:id', async (req, res) => {
    try {
        const resident = await Resident.findByIdAndDelete(req.params.id);

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: 'Resident not found'
            });
        }

        res.json({
            success: true,
            message: 'Resident deleted successfully',
            data: resident
        });
    } catch (error) {
        console.error('Delete resident error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete resident',
            error: error.message
        });
    }
});

// Get resident statistics
router.get('/stats/overview', async (req, res) => {
    try {
        // Total count
        const totalResidents = await Resident.countDocuments();

        // Gender distribution
        const genderDistribution = await Resident.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        // Age distribution - calculate ages from birthdates
        const ageDistribution = {
            'Under 18': 0,
            '18-30': 0,
            '31-45': 0,
            '46-60': 0,
            'Over 60': 0
        };

        const allResidents = await Resident.find({}, 'birthdate');
        const today = new Date();

        allResidents.forEach(resident => {
            if (!resident.birthdate) return;

            const birthDate = new Date(resident.birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) ageDistribution['Under 18']++;
            else if (age <= 30) ageDistribution['18-30']++;
            else if (age <= 45) ageDistribution['31-45']++;
            else if (age <= 60) ageDistribution['46-60']++;
            else ageDistribution['Over 60']++;
        });

        // Civil status distribution
        const civilStatusDistribution = await Resident.aggregate([
            { $group: { _id: '$civilStatus', count: { $sum: 1 } } }
        ]);

        // Voter status count
        const voterCount = await Resident.countDocuments({ voterStatus: true });

        res.json({
            success: true,
            data: {
                totalResidents,
                genderDistribution,
                ageDistribution,
                civilStatusDistribution,
                voterCount,
                voterPercentage: Math.round((voterCount / totalResidents) * 100)
            }
        });
    } catch (error) {
        console.error('Get resident statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resident statistics',
            error: error.message
        });
    }
});

module.exports = router;
