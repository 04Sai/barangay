const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Health Service',
            'Health Advisory', 
            'Community Event',
            'Utility Advisory',
            'Sports Event',
            'Service Advisory',
            'Emergency'
        ]
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    source: {
        type: String,
        default: 'Admin',
        enum: ['Admin', 'Barangay', 'Health Services']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // For now, make it optional
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
announcementSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
