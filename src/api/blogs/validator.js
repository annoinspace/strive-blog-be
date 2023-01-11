import { checkSchema, validationResult } from "express-validator"

const blogSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field"
    }
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field"
    }
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "name needs to be a string"
    }
  }
}

export const checkBlogsSchema = checkSchema(blogSchema)

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors.array())

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during blog validation", {
        errorsList: errors.array()
      })
    )
  } else {
    next()
  }
}
