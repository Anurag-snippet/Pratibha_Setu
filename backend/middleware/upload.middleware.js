const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads/resumes'),
  path.join(__dirname, '../uploads/certificates'),
  path.join(__dirname, '../uploads/documents'),
  path.join(__dirname, '../uploads/photos'),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(__dirname, '../uploads/documents');

    if (file.fieldname === 'resume' || req.body.docType === 'resume') {
      dest = path.join(__dirname, '../uploads/resumes');
    } else if (
      file.fieldname === 'certificate' ||
      req.body.docType === 'certificate' ||
      req.body.type === 'certificate'
    ) {
      dest = path.join(__dirname, '../uploads/certificates');
    } else if (file.fieldname === 'profilePhoto' || file.fieldname === 'logo') {
      dest = path.join(__dirname, '../uploads/photos');
    }

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user._id.toString() : 'guest';
    const timestamp = Date.now();
    const cleanOriginalName = file.originalname.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${userId}-${timestamp}-${cleanOriginalName}`);
  },
});

// File filter (pdf, jpg, png, docx)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, JPG, PNG, WEBP, and DOC/DOCX files are supported.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

module.exports = upload;
