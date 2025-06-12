const express = require('express');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all residents (users + admins) with advanced filtering
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

        // Build filter object for users
        const userFilter = { isEmailVerified: true }; // Only verified users
        const adminFilter = { isActive: true }; // Only active admins

        if (gender && gender !== 'All') {
            userFilter.gender = gender.toLowerCase();
            adminFilter.gender = gender.toLowerCase();
        }

        // Text search for users
        if (search) {
            userFilter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { middleName: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } }
            ];

            adminFilter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch users and admins
        const users = await User.find(userFilter).select('-password -emailVerificationToken -passwordResetToken');
        const admins = await Admin.find(adminFilter).select('-password');

        // Combine and normalize data
        let allResidents = [];

        // Add users as residents
        users.forEach(user => {
            const birthdate = user.birthday && user.birthday.year && user.birthday.month && user.birthday.day
                ? new Date(`${user.birthday.year}-${user.birthday.month}-${user.birthday.day}`)
                : null;

            allResidents.push({
                _id: user._id,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.contactNumber,
                address: user.address || 'Not specified',
                gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified',
                birthdate: birthdate,
                civilStatus: user.civilStatus ? user.civilStatus.charAt(0).toUpperCase() + user.civilStatus.slice(1) : 'Not specified',
                occupation: 'Resident',
                userType: 'resident',
                voterStatus: false,
                registeredDate: user.createdAt,
                isActive: user.isEmailVerified
            });
        });

        // Add admins as residents
        admins.forEach(admin => {
            allResidents.push({
                _id: admin._id,
                firstName: admin.firstName,
                middleName: '',
                lastName: admin.lastName,
                email: admin.email,
                phoneNumber: admin.contactNumber || 'Not specified',
                address: 'Barangay Office',
                gender: admin.gender ? admin.gender.charAt(0).toUpperCase() + admin.gender.slice(1) : 'Not specified',
                birthdate: admin.birthdate || null,
                civilStatus: 'Not specified',
                occupation: admin.role === 'super_admin' ? 'Barangay Captain' : 'Barangay Staff',
                userType: 'staff',
                voterStatus: true,
                registeredDate: admin.createdAt,
                isActive: admin.isActive
            });
        });

        // Apply age filtering
        if (ageMin || ageMax) {
            allResidents = allResidents.filter(resident => {
                if (!resident.birthdate) return false;

                const today = new Date();
                const birthDate = new Date(resident.birthdate);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (ageMin && age < parseInt(ageMin)) return false;
                if (ageMax && age > parseInt(ageMax)) return false;

                return true;
            });
        }

        // Sorting
        const sortField = sortBy || 'lastName';
        const sortDirection = sortOrder === 'desc' ? -1 : 1;

        allResidents.sort((a, b) => {
            let valueA = a[sortField] || '';
            let valueB = b[sortField] || '';

            if (sortField === 'birthdate' || sortField === 'registeredDate') {
                valueA = new Date(valueA || 0);
                valueB = new Date(valueB || 0);
            }

            if (valueA < valueB) return sortDirection === 1 ? -1 : 1;
            if (valueA > valueB) return sortDirection === 1 ? 1 : -1;
            return 0;
        });

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 20;
        const skip = (pageNumber - 1) * pageSize;
        const paginatedResidents = allResidents.slice(skip, skip + pageSize);

        res.json({
            success: true,
            data: paginatedResidents,
            pagination: {
                current: pageNumber,
                total: Math.ceil(allResidents.length / pageSize),
                count: paginatedResidents.length,
                totalItems: allResidents.length
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

// Get single resident (user or admin)
router.get('/:id', async (req, res) => {
    try {
        let resident = await User.findById(req.params.id).select('-password -emailVerificationToken -passwordResetToken');
        let userType = 'resident';

        if (!resident) {
            resident = await Admin.findById(req.params.id).select('-password');
            userType = 'staff';
        }

        if (!resident) {
            return res.status(404).json({
                success: false,
                message: 'Resident not found'
            });
        }

        // Normalize data structure
        let normalizedResident;

        if (userType === 'resident') {
            const birthdate = resident.birthday && resident.birthday.year && resident.birthday.month && resident.birthday.day
                ? new Date(`${resident.birthday.year}-${resident.birthday.month}-${resident.birthday.day}`)
                : null;

            normalizedResident = {
                _id: resident._id,
                firstName: resident.firstName,
                middleName: resident.middleName,
                lastName: resident.lastName,
                email: resident.email,
                phoneNumber: resident.contactNumber,
                address: resident.address || 'Not specified',
                gender: resident.gender ? resident.gender.charAt(0).toUpperCase() + resident.gender.slice(1) : 'Not specified',
                birthdate: birthdate,
                civilStatus: resident.civilStatus ? resident.civilStatus.charAt(0).toUpperCase() + resident.civilStatus.slice(1) : 'Not specified',
                occupation: 'Resident',
                userType: 'resident',
                voterStatus: false,
                registeredDate: resident.createdAt,
                isActive: resident.isEmailVerified
            };
        } else {
            normalizedResident = {
                _id: resident._id,
                firstName: resident.firstName,
                middleName: '',
                lastName: resident.lastName,
                email: resident.email,
                phoneNumber: resident.contactNumber || 'Not specified',
                address: 'Barangay Office',
                gender: resident.gender ? resident.gender.charAt(0).toUpperCase() + resident.gender.slice(1) : 'Not specified',
                birthdate: resident.birthdate || null,
                civilStatus: 'Not specified',
                occupation: resident.role === 'super_admin' ? 'Barangay Captain' : 'Barangay Staff',
                userType: 'staff',
                voterStatus: true,
                registeredDate: resident.createdAt,
                isActive: resident.isActive
            };
        }

        res.json({
            success: true,
            data: normalizedResident
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

// Create new resident (user)
router.post('/', async (req, res) => {
    try {
        const residentData = req.body;
        const resident = new User(residentData);
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

// Update resident (user or admin)
router.put('/:id', async (req, res) => {
    try {
        const residentData = req.body;
        let resident = await User.findByIdAndUpdate(
            req.params.id,
            residentData,
            { new: true, runValidators: true }
        );
        let userType = 'resident';

        if (!resident) {
            resident = await Admin.findByIdAndUpdate(
                req.params.id,
                residentData,
                { new: true, runValidators: true }
            );
            userType = 'staff';
        }

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

// Delete resident (user or admin)
router.delete('/:id', async (req, res) => {
    try {
        let resident = await User.findByIdAndDelete(req.params.id);

        if (!resident) {
            resident = await Admin.findByIdAndDelete(req.params.id);
        }

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
        // Get counts from both collections
        const totalUsers = await User.countDocuments({ isEmailVerified: true });
        const totalAdmins = await Admin.countDocuments({ isActive: true });
        const totalResidents = totalUsers + totalAdmins;

        // Gender distribution from both collections
        const userGenderDist = await User.aggregate([
            { $match: { isEmailVerified: true, gender: { $exists: true } } },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        const adminGenderDist = await Admin.aggregate([
            { $match: { isActive: true, gender: { $exists: true } } },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        // Combine gender distributions
        const genderDistribution = {};
        [...userGenderDist, ...adminGenderDist].forEach(item => {
            const gender = item._id.charAt(0).toUpperCase() + item._id.slice(1);
            genderDistribution[gender] = (genderDistribution[gender] || 0) + item.count;
        });

        // Age distribution calculation
        const ageDistribution = {
            'Under 18': 0,
            '18-30': 0,
            '31-45': 0,
            '46-60': 0,
            'Over 60': 0
        };

        // Calculate ages from users
        const allUsers = await User.find({ isEmailVerified: true }, 'birthday');
        const allAdmins = await Admin.find({ isActive: true }, 'birthdate');

        const today = new Date();

        // Process user ages
        allUsers.forEach(user => {
            if (!user.birthday || !user.birthday.year) return;

            const birthDate = new Date(`${user.birthday.year}-${user.birthday.month || '01'}-${user.birthday.day || '01'}`);
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

        // Process admin ages
        allAdmins.forEach(admin => {
            if (!admin.birthdate) return;

            const birthDate = new Date(admin.birthdate);
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

        // Civil status distribution (mainly from users)
        const civilStatusDistribution = await User.aggregate([
            { $match: { isEmailVerified: true, civilStatus: { $exists: true } } },
            { $group: { _id: '$civilStatus', count: { $sum: 1 } } }
        ]);

        // All admins are considered voters, some users might be
        const voterCount = totalAdmins; // All staff are voters

        res.json({
            success: true,
            data: {
                totalResidents,
                totalUsers,
                totalStaff: totalAdmins,
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
