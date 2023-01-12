import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const publicFolderPath = join(process.cwd(), "./public/img/users")
console.log("Public folder path in fs-tools-----------", publicFolderPath)
const blogsJSONPath = join(dataFolderPath, "blogs.json")

export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlog = (blogsArray) => writeJSON(blogsJSONPath, blogsArray)

// export const saveUsersAvatars = (fileName, contentAsABuffer) =>
//   writeFile(join(publicFolderPath, fileName), contentAsABuffer)

export const saveCoverPhoto = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer)

export const getBlogsJsonReadableStream = () => createReadStream(blogsJSONPath)
export const getPDFWriteableStream = (filename) => createWriteStream(join(dataFolderPath, filename))
