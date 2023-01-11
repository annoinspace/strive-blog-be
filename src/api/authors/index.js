import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()

console.log("CURRENT FILE URL:", import.meta.url)
console.log("CURRENT FILE PATH:", fileURLToPath(import.meta.url))
// getting the parent folder
console.log("PARENT FOLDER PATH:", dirname(fileURLToPath(import.meta.url)))
//concatenating parent folder path with "authors.json"
console.log(
  "TARGET:",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
)

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
)

// 1. POST http://localhost:3001/authors/ (+body)

authorsRouter.post("/", (req, res) => {
  // original code without checking for the email address
  // console.log("REQ BODY", req.body)
  // const newAuthor = {
  //   ...req.body,
  //   createdAt: new Date(),
  //   id: uniqid(),
  //   avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
  // }
  // const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  // authorsArray.push(newAuthor)
  // fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  // res.status(201).send({
  //   id: newAuthor.id
  // })
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const email = req.body.email

  const authorWithSameEmail = authorsArray.find(
    (author) => author.email === email
  )
  if (authorWithSameEmail === undefined) {
    const newAuthor = {
      ...req.body,
      createdAt: new Date(),
      id: uniqid(),
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    }

    authorsArray.push(newAuthor)

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
    res.status(201).send({ id: newAuthor.id, message: "email is unique" })
  } else {
    res.status(400).send(email + " already exists.")
  }
})

// 2. GET http://localhost:3001/authors/
authorsRouter.get("/", (req, res) => {
  // first we want to read the content of the authors.json file
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath) // Here you obtain a BUFFER object, which is a MACHINE READABLE FORMAT
  console.log("fileContentAsBuffer", fileContentAsBuffer)
  const authorsArray = JSON.parse(fileContentAsBuffer)
  console.log("file content:", authorsArray)
  res.send(authorsArray)
})

// 3. GET http://localhost:3001/authors/:authorId
authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId
  console.log("AUTHOR ID", authorId)

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const author = authorsArray.find((author) => author.id === authorId)

  res.send(author)
})

// 4. PUT http://localhost:3001/authors/:authorId
authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  )
  const oldAuthor = authorsArray[index]
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
  authorsArray[index] = updatedAuthor
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  res.send(updatedAuthor)
})

// 5. DELETE http://localhost:3001/authors/:authorId
authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  )
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  res.send()
})

export default authorsRouter
