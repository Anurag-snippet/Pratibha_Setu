const mongoose = require('mongoose');

const academicianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

academicianSchema.index({ institutionId: 1 });

module.exports = mongoose.model('Academician', academicianSchema);
