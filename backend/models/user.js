const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  solvedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }], // Array of solved problem IDs
  submittedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }], // Array of submitted problem IDs
  submissionCount: { type: Number, default: 0 }, // Total number of submissions 
  problemsSolved: { type: Number, default: 0 }, // Total number of problems solved
  problemsSolvedByLevel: {
    Easy: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Hard: { type: Number, default: 0 },
  }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
