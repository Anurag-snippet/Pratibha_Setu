const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    industrySector: {
      type: String,
      trim: true,
      default: 'Ayurveda & Herbal Formulations',
    },
    website: {
      type: String,
      trim: true,
    },
    logoPath: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Industry', industrySchema);
