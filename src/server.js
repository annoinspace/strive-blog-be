import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import cors from "cors"
import { join } from "path"
import blogsRouter from "./api/blogs/index.js"
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import filesRouter from "./api/files/index.js"
import { getBlogs } from "./lib/fs-tools.js"

const server = express()

const port = process.env.PORT
const publicFolderPath = join(process.cwd(), "./public")
console.log("Public folder path in server-----------", publicFolderPath)

// ---------------- WHITELIST FOR CORS ------------------

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOptions = {
  origin: (origin, corsNext) => {
    console.log("-----CURRENT ORIGIN -----", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true)
    } else {
      corsNext(createHttpError(400, `Origin ${origin} is not in the whitelist!`))
    }
  }
}

server.use(express.static(publicFolderPath))
server.use(express.json())
server.use(cors(corsOptions))
// ****************** ENDPOINTS ********************
server.use("/authors", authorsRouter)
server.use("/blogs", blogsRouter)
server.use("/files", filesRouter)
// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notFoundHandler) // 404
server.use(genericErrorHandler) // 500
// (the order of these error handlers does not really matters, expect for genericErrorHandler which needs to be the last in chain)
server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("server is running on port:", port)
  // const blogs = await getBlogs()
  // console.log(blogs)
})
