const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

/**
 * @desc    Upload a new document (resume, certificate, academic record)
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a file to upload.',
      });
    }

    const { docType } = req.body;
    const subFolder =
      docType === 'resume'
        ? 'resumes'
        : docType === 'certificate'
        ? 'certificates'
        : 'documents';

    const relativePath = `/uploads/${subFolder}/${req.file.filename}`;

    const document = await Document.create({
      userId: req.user._id,
      docType: (docType || 'other').toLowerCase(),
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: relativePath,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents for a user
 * @route   GET /api/documents/:userId
 * @access  Private
 */
const getUserDocuments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const documents = await Document.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete document by ID
 * @route   DELETE /api/documents/:id
 * @access  Private (Owner or Admin)
 */
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Ownership check
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own documents.',
      });
    }

    // Attempt to remove file from disk
    const absoluteDiskPath = path.join(__dirname, '..', document.filePath);
    if (fs.existsSync(absoluteDiskPath)) {
      try {
        fs.unlinkSync(absoluteDiskPath);
      } catch (err) {
        console.warn(`Could not remove file at ${absoluteDiskPath}:`, err.message);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  deleteDocument,
};
