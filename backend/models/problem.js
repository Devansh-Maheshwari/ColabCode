const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    inputCases: {
        type: Array,
        required: true,
    },
    outputCases: {
        type: Array,
        required: true,
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
   
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
