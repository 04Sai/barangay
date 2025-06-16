const mongoose = require('mongoose');

const hotlineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotline name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\+]?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
    },
    alternateNumber: {
        type: String,
        trim: true,
        match: [/^[\+]?[\d\s\-\(\)]+$/, 'Please provide a valid alternate phone number']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            "Emergency",
    "Health Services",
    "Police & Security",
    "Fire Department",
    "Medical Emergency",
    "Animal Bite Center",
    "Peace and Order",
    "Towing Services and Assistance"
        ]
    },
    priority: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    availability: {
        type: String,
        enum: ['24/7', 'Business Hours', 'Weekdays Only', 'Weekends Only', 'Custom'],
        default: '24/7'
    },
    customHours: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    website: {
        type: String,
        trim: true
    },
    coordinates: {
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    responseTime: {
        type: String,
        enum: ['Immediate', 'Within 5 minutes', 'Within 15 minutes', 'Within 30 minutes', 'Within 1 hour', 'Variable'],
        default: 'Variable'
    },
    languages: [{
        type: String,
        enum: ['English', 'Filipino', 'Tagalog', 'Cebuano', 'Ilocano', 'Hiligaynon', 'Waray', 'Kapampangan', 'Bikol']
    }],
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    specialInstructions: {
        type: String,
        trim: true,
        maxlength: [1000, 'Special instructions cannot exceed 1000 characters']
    },
    lastVerified: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

// Index for better search performance
hotlineSchema.index({ name: 'text', description: 'text', category: 1 });
hotlineSchema.index({ category: 1, priority: 1 });
hotlineSchema.index({ isActive: 1, isVerified: 1 });

// Update the updatedAt field before saving
hotlineSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for formatted phone number
hotlineSchema.virtual('formattedPhone').get(function() {
    if (this.phoneNumber) {
        return this.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return this.phoneNumber;
});

const Hotline = mongoose.model('Hotline', hotlineSchema);

module.exports = Hotline;
