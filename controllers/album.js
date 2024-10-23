const Album = require("../models/Album")
const path = require("path")

exports.addImages = async (req, res) => {
  const { tripId } = req.params
  const imageFiles = req.files

  try {
    const uploadedImages = imageFiles.map((file) => `/uploads/${file.filename}`)

    let album = await Album.findOne({ tripId })
    if (album) {
      album.images.push(...uploadedImages)
      await album.save()
    } else {
      album = new Album({ tripId, images: uploadedImages })
      await album.save()
    }

    res
      .status(201)
      .json({ message: "Images added to album successfully", album })
  } catch (error) {
    console.error("Error adding images to album:", error)
    res
      .status(500)
      .json({ message: "Error adding images to album", error: error.message })
  }
}

exports.getAlbum = async (req, res) => {
  const { tripId } = req.params

  try {
    const album = await Album.findOne({ tripId })
    if (!album) {
      return res.status(404).json({ message: "Album not found" })
    }

    res.status(200).json({ album })
  } catch (error) {
    console.error("Error fetching album:", error)
    res
      .status(500)
      .json({ message: "Error fetching album", error: error.message })
  }
}
