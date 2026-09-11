const mongoose = require('mongoose');

const assessmentResponseSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion',
    },
    responseValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    scoreAwarded: {
      type: Number,
      default: 0,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

assessmentResponseSchema.index({ studentId: 1 });

module.exports = mongoose.model('AssessmentResponse', assessmentResponseSchema);
