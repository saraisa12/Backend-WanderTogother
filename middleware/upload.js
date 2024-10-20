// middleware/upload.js
const multer = require("multer")
const path = require("path")

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`) // Unique filename
  },
})

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow only images
    const ext = path.extname(file.originalname)
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only images are allowed"), false)
    }
    cb(null, true)
  },
})

module.exports = upload
