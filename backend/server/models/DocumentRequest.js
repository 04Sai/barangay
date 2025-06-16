const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        unique: true,
        default: function() {
            return 'DR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    documentTypes: [{
        type: {
            type: String,
            enum: [
                'Barangay Clearance',
                'Barangay Certificate', 
                'Certificate of Indigency',
                'Business Permit',
                'Residency Certificate',
                'Other'
            ],
            required: true
        },
        otherDescription: {
            type: String,
            required: function() { return this.type === 'Other'; }
        },
        fee: {
            type: Number,
            default: 0
        },
        processingDays: {
            type: Number,
            default: 3
        }
    }],
    
    // Requestor information
    requestor: {
        name: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        validId: {
            type: String,
            trim: true
        }
    },

    // Appointment details
    appointment: {
        preferredDate: {
            type: Date,
            required: [true, 'Preferred appointment date is required']
        },
        preferredTime: {
            type: String,
            required: [true, 'Preferred appointment time is required']
        },
        confirmedDate: Date,
        confirmedTime: String,
        venue: {
            type: String,
            default: 'Barangay Hall - Document Services Window'
        }
    },

    // Processing information
    status: {
        type: String,
        enum: [
            'Pending Review',
            'Appointment Scheduled', 
            'Requirements Submitted',
            'Under Processing',
            'Ready for Release',
            'Released',
            'Cancelled',
            'Rejected'
        ],
        default: 'Pending Review'
    },
    priority: {
        type: String,
        enum: ['Normal', 'Urgent', 'Express'],
        default: 'Normal'
    },
    
    // Requirements and documents
    requirements: [{
        document: String,
        status: {
            type: String,
            enum: ['Required', 'Submitted', 'Verified', 'Missing'],
            default: 'Required'
        },
        notes: String,
        submittedAt: Date
    }],
    
    // Payment information
    payment: {
        totalFee: {
            type: Number,
            default: 0
        },
        paidAmount: {
            type: Number,
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ['Unpaid', 'Partial', 'Paid', 'Refunded'],
            default: 'Unpaid'
        },
        paymentMethod: {
            type: String,
            enum: ['Cash', 'GCash', 'Bank Transfer', 'Other']
        },
        receiptNumber: String,
        paidAt: Date
    },

    // Processing details
    processing: {
        assignedTo: {
            type: String,
            default: 'Document Services Officer'
        },
        estimatedCompletionDate: Date,
        actualCompletionDate: Date,
        processingNotes: String
    },

    // Activity log
    history: [{
        action: {
            type: String,
            required: true
        },
        details: String,
        performedBy: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        previousStatus: String
    }],

    // System fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Pre-save middleware to ensure requestId is generated
documentRequestSchema.pre('save', function(next) {
    if (!this.requestId) {
        this.requestId = 'DR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    this.updatedAt = new Date();
    next();
});

// Generate unique request ID
documentRequestSchema.pre('save', async function(next) {
    if (this.isNew) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await this.constructor.countDocuments() + 1;
        this.requestId = `DOC-${year}${month}-${String(count).padStart(4, '0')}`;
        
        // Add initial history entry
        this.history.push({
            action: 'Request Submitted',
            details: 'Document request submitted by citizen',
            performedBy: this.requestor.name,
            timestamp: new Date()
        });
        
        // Calculate total fee based on document types
        this.payment.totalFee = this.documentTypes.reduce((total, doc) => total + (doc.fee || 0), 0);
        
        // Set estimated completion date
        const maxProcessingDays = Math.max(...this.documentTypes.map(doc => doc.processingDays || 3));
        this.processing.estimatedCompletionDate = new Date(Date.now() + maxProcessingDays * 24 * 60 * 60 * 1000);
    }
    next();
});

// Index for better search performance
documentRequestSchema.index({ requestId: 1 });
documentRequestSchema.index({ 'requestor.name': 'text', 'requestor.contactNumber': 'text' });
documentRequestSchema.index({ status: 1 });
documentRequestSchema.index({ 'appointment.preferredDate': 1 });

const DocumentRequest = mongoose.model('DocumentRequest', documentRequestSchema);

module.exports = DocumentRequest;
