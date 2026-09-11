const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Portfolio item type is required'],
      enum: {
        values: ['certificate', 'project', 'achievement'],
        message: '{VALUE} is not a valid portfolio item type',
      },
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    issuer: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    filePath: {
      type: String,
      default: '',
    },
    issuedDate: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

portfolioItemSchema.index({ studentId: 1 });
portfolioItemSchema.index({ type: 1 });

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
