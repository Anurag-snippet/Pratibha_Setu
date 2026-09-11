const mongoose = require('mongoose');

const studentSkillSubSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    proficiencyScore: {
      type: Number,
      min: [0, 'Proficiency score cannot be less than 0'],
      max: [100, 'Proficiency score cannot be greater than 100'],
      default: 50,
    },
    assessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
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
    course: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    bio: {
      type: String,
      trim: true,
    },
    profilePhotoPath: {
      type: String,
      default: '',
    },
    skills: [studentSkillSubSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
studentSchema.index({ institutionId: 1 });
studentSchema.index({ 'skills.skillId': 1 });

module.exports = mongoose.model('Student', studentSchema);
