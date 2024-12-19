const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Accepted', 'Runtime Error', 'Compilation Error','Wrong Answer'],
        default: 'Compilation Error',
    },
    code: {
        type: String,  // Store the submitted code
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
