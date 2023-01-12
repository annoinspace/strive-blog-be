import express from "express"
import multer from "multer"
import { extname } from "path"
import { pipeline } from "stream"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import json2csv from "json2csv"
import { getBlogs, writeBlog, saveCoverPhoto, getBlogsJsonReadableStream } from "../../lib/fs-tools.js"
import { sendRegistrationEmail } from "../../lib/email-tools.js"
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

// get all blogs + specified info as pdf

filesRouter.get("/pdf", async (req, res, next) => {
  const blogsArray = await getBlogs()
  res.setHeader("Content-Disposition", "attachment; filename=blogs.pdf")
  const source = getPDFReadableStream(blogsArray)
  const destination = res

  pipeline(source, destination, (err) => {
    if (err) console.log(err)
  })
})

export default filesRouter

// get blogs and specified info as CSV file

filesRouter.get("/csv", async (req, res, next) => {
  try {
    const source = await getBlogsJsonReadableStream()
    res.setHeader("Content-Disposition", "attachment; filename=blogscsv.csv")
    const transform = new json2csv.Transform({ fields: ["_id", "title", "category"] })
    const destination = res
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body
    await sendRegistrationEmail(email)
    res.send({ message: `email sent successfully to - ${email}` })
  } catch (error) {
    next(error)
  }
})

// adlflg;
