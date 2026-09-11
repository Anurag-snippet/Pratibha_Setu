const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    docType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: {
        values: ['resume', 'certificate', 'academic_record', 'other'],
        message: '{VALUE} is not a supported document type',
      },
      lowercase: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    mimeType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ userId: 1 });
documentSchema.index({ docType: 1 });

module.exports = mongoose.model('Document', documentSchema);
