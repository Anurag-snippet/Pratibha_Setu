const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: [true, 'Opportunity ID is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['applied', 'shortlisted', 'rejected', 'selected'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'applied',
      lowercase: true,
    },
    coverNote: {
      type: String,
      trim: true,
      default: '',
    },
    mentorFeedback: {
      type: String,
      trim: true,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    timeline: [
      {
        label: { type: String, required: true },
        date: { type: String, required: true },
        done: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate applications
applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ studentId: 1 });
applicationSchema.index({ opportunityId: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
