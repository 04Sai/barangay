const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    incidentTypes: [{
        type: String,
        enum: [
            'Accident',
            'Crime',
            'Fire',
            'Medical Emergency',
            'Natural Disaster',
            'Public Disturbance',
            'Infrastructure Issue',
            'Environmental Hazard',
            'Traffic Incident',
            'Domestic Violence',
            'Theft/Robbery',
            'Vandalism',
            'Noise Complaint',
            'Animal Related',
            'Drug Related',
            'Other'
        ]
    }],
    location: {
        address: {
            type: String,
            required: [true, 'Location address is required'],
            trim: true,
            maxlength: [200, 'Address cannot exceed 200 characters']
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
        landmark: {
            type: String,
            trim: true
        }
    },
    dateTime: {
        occurred: {
            type: Date,
            required: [true, 'Incident date and time is required']
        },
        reported: {
            type: Date,
            default: Date.now
        }
    },
    reporter: {
        name: {
            type: String,
            required: [true, 'Reporter name is required'],
            trim: true,
            maxlength: [100, 'Reporter name cannot exceed 100 characters']
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
            trim: true,
            match: [/^[\+]?[\d\s\-\(\)]+$/, 'Please provide a valid contact number']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
        },
        address: {
            type: String,
            trim: true
        },
        relationship: {
            type: String,
            enum: ['Victim', 'Witness', 'Concerned Citizen', 'Official', 'Anonymous'],
            default: 'Concerned Citizen'
        }
    },
    affectedPersons: [{
        name: {
            type: String,
            trim: true
        },
        age: {
            type: Number,
            min: [0, 'Age cannot be negative'],
            max: [150, 'Age cannot exceed 150']
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say']
        },
        condition: {
            type: String,
            enum: ['Unharmed', 'Minor Injury', 'Serious Injury', 'Critical', 'Deceased', 'Unknown']
        },
        relationship: {
            type: String,
            trim: true
        }
    }],
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: [true, 'Severity level is required'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'Under Investigation', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    assignedTo: {
        department: {
            type: String,
            enum: [
                'Barangay Security',
                'Police',
                'Fire Department',
                'Medical Services',
                'Public Works',
                'Environmental Office',
                'Social Services',
                'Traffic Management',
                'Other'
            ]
        },
        officer: {
            type: String,
            trim: true
        },
        contactInfo: {
            type: String,
            trim: true
        }
    },
    evidence: {
        photos: [{
            url: String,
            description: String,
            uploadedAt: { type: Date, default: Date.now }
        }],
        documents: [{
            url: String,
            filename: String,
            description: String,
            uploadedAt: { type: Date, default: Date.now }
        }],
        witnesses: [{
            name: String,
            contactNumber: String,
            statement: String
        }]
    },
    followUp: {
        required: {
            type: Boolean,
            default: false
        },
        scheduledDate: Date,
        notes: String
    },
    resolution: {
        summary: {
            type: String,
            trim: true,
            maxlength: [1000, 'Resolution summary cannot exceed 1000 characters']
        },
        actionsTaken: [{
            action: String,
            takenBy: String,
            date: { type: Date, default: Date.now },
            notes: String
        }],
        resolvedDate: Date,
        resolvedBy: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    isEmergency: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    confidentialityLevel: {
        type: String,
        enum: ['Public', 'Restricted', 'Confidential', 'Classified'],
        default: 'Restricted'
    },
    relatedIncidents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IncidentReport'
    }],
    updates: [{
        message: String,
        updatedBy: String,
        updateDate: { type: Date, default: Date.now },
        statusChange: {
            from: String,
            to: String
        }
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

// Indexes for better search performance
incidentReportSchema.index({ 
    title: 'text', 
    description: 'text', 
    'location.address': 'text',
    'reporter.name': 'text'
});
incidentReportSchema.index({ status: 1, priority: 1, severity: 1 });
incidentReportSchema.index({ 'dateTime.occurred': -1 });
incidentReportSchema.index({ incidentTypes: 1 });
incidentReportSchema.index({ 'location.coordinates': '2dsphere' });

// Update the updatedAt field before saving
incidentReportSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Auto-generate tags based on incident types and location
    if (this.isNew) {
        const autoTags = [];
        if (this.incidentTypes) {
            autoTags.push(...this.incidentTypes.map(type => type.toLowerCase()));
        }
        if (this.location.address) {
            autoTags.push(...this.location.address.toLowerCase().split(' ').filter(word => word.length > 2));
        }
        this.tags = [...(this.tags || []), ...autoTags].filter((tag, index, self) => self.indexOf(tag) === index);
    }
    
    next();
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
