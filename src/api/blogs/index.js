import express from "express"
import uniqid from "uniqid"
import httpErrors from "http-errors"
// import { pipeline } from "stream"
// import { getPDFReadableStream } from "../../lib/pdf-tools.js"
import { checkBlogsSchema, triggerBadRequest } from "./validator.js"
import { getBlogs, writeBlog } from "../../lib/fs-tools.js"

const { NotFound } = httpErrors

const blogsRouter = express.Router()

blogsRouter.post("/", checkBlogsSchema, triggerBadRequest, async (req, res, next) => {
  try {
    const newBlog = {
      ...req.body,
      _id: uniqid(),
      category: req.body.category,
      title: req.body.title,
      text: req.body.text,
      cover: `https://random.imagecdn.app/600/600`,
      readTime: {
        value: 5,
        unit: "mins"
      },
      author: {
        name: req.body.author.name,
        avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`
      },
      content: "HTML",
      createdAt: new Date()
    }
    const blogsArray = await getBlogs()
    blogsArray.push(newBlog)
    writeBlog(blogsArray)
    res.status(201).send({ _id: newBlog._id })
  } catch (error) {
    console.log("error adding new blog")
    next(error)
  }
})

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs()
    res.status(200).send(blogsArray)
  } catch (error) {
    console.log("error getting blogs")
    next(error)
  }
})

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs()
    const blog = blogsArray.find((blog) => blog._id === req.params.blogId)

    if (blog) {
      res.send(blog)
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs()
    const index = blogsArray.findIndex((blog) => blog._id === req.params.blogId)

    const oldBlog = blogsArray[index]
    const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() }
    blogsArray[index] = updatedBlog
    await writeBlog(blogsArray)
    res.send(updatedBlog)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogs = await getBlogs()

    const remainingBlogs = blogs.filter((blog) => blog._id !== req.params.blogId)

    if (blogs.length !== remainingBlogs.length) {
      await writeBlog(remainingBlogs)
      res.status(204).send()
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// blogsRouter.get("/pdf", (req, res, next) => {
//   const blogsArray = getBlogs()
//   res.setHeader("Content-Disposition", "attachment; filename=blogs.pdf")
//   const source = getPDFReadableStream(blogsArray)
//   const destination = res

//   pipeline(source, destination, (err) => {
//     if (err) console.log(err)
//   })
// })

export default blogsRouter
