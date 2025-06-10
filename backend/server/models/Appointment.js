const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    type: {
        type: String,
        required: [true, 'Appointment type is required'],
        enum: [
            'Consultation',
            'Document Request',
            'Complaint Filing',
            'Certificate Request',
            'Business Permit',
            'Barangay Clearance',
            'Residency Certificate',
            'Indigency Certificate',
            'Health Service',
            'Social Service',
            'Legal Assistance',
            'Emergency Meeting',
            'Community Meeting',
            'Other'
        ]
    },
    appointee: {
        name: {
            type: String,
            required: [true, 'Appointee name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters']
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
            trim: true,
            maxlength: [200, 'Address cannot exceed 200 characters']
        },
        age: {
            type: Number,
            min: [1, 'Age must be at least 1'],
            max: [150, 'Age cannot exceed 150']
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say']
        }
    },
    dateTime: {
        scheduled: {
            type: Date,
            required: [true, 'Scheduled date and time is required']
        },
        created: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        }
    },
    duration: {
        type: Number, // Duration in minutes
        default: 30,
        min: [15, 'Duration must be at least 15 minutes'],
        max: [480, 'Duration cannot exceed 8 hours']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    location: {
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true
        },
        room: {
            type: String,
            trim: true
        },
        address: {
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
        }
    },
    assignedTo: {
        official: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            enum: [
                'Barangay Captain',
                'Secretary',
                'Treasurer',
                'Kagawad',
                'SK Chairman',
                'Health Officer',
                'Social Worker',
                'Administrative Office',
                'Other'
            ]
        },
        contactInfo: {
            type: String,
            trim: true
        }
    },
    requirements: [{
        document: {
            type: String,
            trim: true
        },
        isRequired: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Submitted', 'Verified', 'Missing'],
            default: 'Pending'
        },
        notes: {
            type: String,
            trim: true
        }
    }],
    notes: {
        public: {
            type: String,
            trim: true,
            maxlength: [500, 'Public notes cannot exceed 500 characters']
        },
        private: {
            type: String,
            trim: true,
            maxlength: [1000, 'Private notes cannot exceed 1000 characters']
        }
    },
    reminders: [{
        type: {
            type: String,
            enum: ['SMS', 'Email', 'Call'],
            required: true
        },
        scheduledTime: {
            type: Date,
            required: true
        },
        sent: {
            type: Boolean,
            default: false
        },
        sentAt: Date,
        message: String
    }],
    followUp: {
        required: {
            type: Boolean,
            default: false
        },
        scheduledDate: Date,
        notes: String,
        completed: {
            type: Boolean,
            default: false
        }
    },
    feedback: {
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Feedback comment cannot exceed 500 characters']
        },
        submittedAt: Date
    },
    attachments: [{
        filename: String,
        originalName: String,
        url: String,
        size: Number,
        mimeType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    history: [{
        action: {
            type: String,
            enum: ['Created', 'Updated', 'Confirmed', 'Cancelled', 'Rescheduled', 'Completed', 'No Show'],
            required: true
        },
        details: String,
        performedBy: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        previousValues: mongoose.Schema.Types.Mixed
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isUrgent: {
        type: Boolean,
        default: false
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
        },
        interval: Number, // Every X days/weeks/months/years
        endDate: Date,
        occurrences: Number
    },
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
appointmentSchema.index({ 'appointee.name': 'text', title: 'text', description: 'text' });
appointmentSchema.index({ status: 1, priority: 1 });
appointmentSchema.index({ 'dateTime.scheduled': 1 });
appointmentSchema.index({ type: 1 });
appointmentSchema.index({ 'assignedTo.department': 1 });

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.dateTime.lastModified = new Date();
    
    // Auto-generate tags based on type and appointee info
    if (this.isNew) {
        const autoTags = [];
        if (this.type) {
            autoTags.push(this.type.toLowerCase());
        }
        if (this.appointee.name) {
            autoTags.push(...this.appointee.name.toLowerCase().split(' ').filter(word => word.length > 2));
        }
        this.tags = [...(this.tags || []), ...autoTags].filter((tag, index, self) => self.indexOf(tag) === index);
    }
    
    next();
});

// Virtual for appointment duration display
appointmentSchema.virtual('durationDisplay').get(function() {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
});

// Virtual for time until appointment
appointmentSchema.virtual('timeUntilAppointment').get(function() {
    const now = new Date();
    const scheduled = new Date(this.dateTime.scheduled);
    const diffTime = scheduled - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past due';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
