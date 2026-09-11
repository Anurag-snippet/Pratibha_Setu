const mongoose = require('mongoose');

const requiredSkillSubSchema = new mongoose.Schema(
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
  },
  { _id: false }
);

const opportunitySchema = new mongoose.Schema(
  {
    postedByIndustryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
      required: [true, 'Industry ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Opportunity type is required'],
      enum: {
        values: ['internship', 'job', 'workshop', 'mentorship', 'fdp', 'research'],
        message: '{VALUE} is not a supported opportunity type',
      },
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      trim: true,
      default: 'Pan-India',
    },
    mode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    duration: {
      type: String,
      trim: true,
      default: '3 months',
    },
    stipend: {
      type: Number,
      default: 0,
      min: [0, 'Stipend cannot be negative'],
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      lowercase: true,
    },
    audience: {
      type: String,
      enum: ['student', 'faculty', 'all'],
      default: 'student',
    },
    requiredSkills: [requiredSkillSubSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ 'requiredSkills.skillId': 1 });
opportunitySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
