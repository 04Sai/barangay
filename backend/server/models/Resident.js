const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    birthdate: {
        type: Date,
        required: [true, 'Birthdate is required']
    },
    civilStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', '']
    },
    occupation: {
        type: String,
        trim: true
    },
    voterStatus: {
        type: Boolean,
        default: false
    },
    householdRole: {
        type: String,
        enum: ['Head', 'Spouse', 'Child', 'Member', 'Extended Family'],
        default: 'Member'
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
residentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Resident = mongoose.model('Resident', residentSchema);

module.exports = Resident;
