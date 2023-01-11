import express from "express"
import multer from "multer"
import { extname } from "path"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import { createGzip } from "zlib"
import { getBlogs, writeBlog, saveCoverPhoto } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search in .env vars for smt called process.env.CLOUDINARY_URL
    params: {
      folder: "blog-covers"
    }
  })
}).single("cover")

filesRouter.post("/:blogId/uploadCover", cloudinaryUploader, async (req, res, next) => {
  try {
    // const originalFileExtension = extname(req.file.originalname)
    // const fileName = req.params.blogId + originalFileExtension
    // await saveCoverPhoto(fileName, req.file.buffer)
    //   url to use for the mew image
    // const url = `http://localhost:3001/img/users/${fileName}`
    console.log(req.file, "req.file ")
    const url = req.file.path

    const blogs = await getBlogs()
    const index = blogs.findIndex((blog) => blog._id === req.params.blogId)
    //   updating the blog cover
    if (index !== -1) {
      const oldBlog = blogs[index]
      // const coverUpdate = { ...oldBlog, cover: url }
      const updatedBlog = { ...oldBlog, cover: url, updatedAt: new Date() }
      blogs[index] = updatedBlog
      await writeBlog(blogs)
    }
    res.send("Cover image updated")
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/:blogId/blogpdf", (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf")
  const blogsArray = getBlogs()
  const source = getPDFReadableStream(blogsArray)
  const destination = res

  pipeline(source, destination, (err) => {
    if (err) console.log(err)
  })
})

export default filesRouter
