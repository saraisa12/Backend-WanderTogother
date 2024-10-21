const multer = require('multer')
const path = require('path')

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// Multer filter for validating file types (optional, but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'),
      false
    )
  }
}

// Create an upload instance with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB (optional)
})

module.exports = upload
