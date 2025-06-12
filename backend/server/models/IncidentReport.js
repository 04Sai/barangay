const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    incidentTypes: [{
        type: String,
        required: true,
        enum: [
            'Medical Emergency',
            'Fire',
            'Crime',
            'Traffic Accident',
            'Natural Disaster',
            'Utility Problem',
            'Public Safety',
            'Environmental Issue',
            'Infrastructure Problem',
            'Other'
        ]
    }],
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    status: {
        type: String,
        enum: ['Pending', 'Investigating', 'In Progress', 'Resolved', 'Closed', 'Cancelled'],
        default: 'Pending'
    },
    location: {
        address: {
            type: String,
            trim: true,
            maxlength: [300, 'Address cannot exceed 300 characters']
        },
        // Store coordinates as separate fields for easier access
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        },
        // GeoJSON Point for geospatial queries (optional)
        geoPoint: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere'
            }
        }
    },
    reporter: {
        name: {
            type: String,
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters']
        },
        contactNumber: {
            type: String,
            trim: true,
            match: [/^[\+]?[\d\s\-\(\)]+$/, 'Please provide a valid contact number']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
        }
    },
    dateTime: {
        occurred: {
            type: Date,
            default: Date.now
        },
        reported: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        }
    },
    attachments: [{
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        data: {
            type: String, // Base64 encoded image data
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimeType: {
            type: String,
            required: true,
            match: /^image\//
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isEmergency: {
        type: Boolean,
        default: false
    },
    assignedTo: {
        official: String,
        department: {
            type: String,
            enum: [
                'Barangay Captain',
                'Secretary', 
                'Kagawad',
                'SK Chairman',
                'Health Officer',
                'Peace and Order',
                'Emergency Response',
                'Public Works',
                'Social Services',
                'Other'
            ]
        },
        assignedDate: Date
    },
    updates: [{
        message: {
            type: String,
            required: true
        },
        updateDate: {
            type: Date,
            default: Date.now
        },
        updatedBy: String,
        statusChange: {
            from: String,
            to: String
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedBy: {
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

// Indexes for better search performance (simplified to avoid conflicts)
incidentReportSchema.index({ title: 'text', description: 'text' });
incidentReportSchema.index({ status: 1 });
incidentReportSchema.index({ severity: 1 });
incidentReportSchema.index({ priority: 1 });
incidentReportSchema.index({ 'dateTime.occurred': -1 });
incidentReportSchema.index({ incidentTypes: 1 });
incidentReportSchema.index({ isEmergency: 1 });
incidentReportSchema.index({ createdAt: -1 });

// Pre-save middleware to handle coordinates
incidentReportSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.dateTime.lastModified = new Date();
    
    // Create GeoJSON point if coordinates are provided
    if (this.location && this.location.latitude && this.location.longitude) {
        this.location.geoPoint = {
            type: 'Point',
            coordinates: [this.location.longitude, this.location.latitude] // [lng, lat] for GeoJSON
        };
    }
    
    // Auto-generate tags based on incident types and location
    if (this.isNew) {
        const autoTags = [];
        if (this.incidentTypes) {
            autoTags.push(...this.incidentTypes.map(type => type.toLowerCase()));
        }
        if (this.location && this.location.address) {
            autoTags.push(...this.location.address.toLowerCase().split(' ').filter(word => word.length > 2));
        }
        this.tags = [...(this.tags || []), ...autoTags].filter((tag, index, self) => self.indexOf(tag) === index);
    }
    
    next();
});

// Virtual for backward compatibility with coordinates object
incidentReportSchema.virtual('location.coordinates').get(function() {
    if (this.location && this.location.latitude && this.location.longitude) {
        return {
            latitude: this.location.latitude,
            longitude: this.location.longitude
        };
    }
    return null;
});

// Virtual for incident age
incidentReportSchema.virtual('incidentAge').get(function() {
    const now = new Date();
    const occurred = new Date(this.dateTime.occurred);
    const diffTime = Math.abs(now - occurred);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for response time
incidentReportSchema.virtual('responseTime').get(function() {
    if (this.status === 'Pending') return null;
    
    const reported = new Date(this.dateTime.reported);
    const firstUpdate = this.updates && this.updates.length > 0 ? new Date(this.updates[0].updateDate) : null;
    
    if (!firstUpdate) return null;
    
    const diffTime = Math.abs(firstUpdate - reported);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return diffHours;
});

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);

module.exports = IncidentReport;