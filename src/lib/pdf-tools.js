import PdfPrinter from "pdfmake"

export const getPDFReadableStream = (blogsArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica"
    }
  }
  const printer = new PdfPrinter(fonts)

  console.log(
    blogsArray.map((blog) => {
      return [blog.title, blog.category, blog.author.name]
    })
  )

  const docDefinition = {
    content: [blogsArray[0].title, blogsArray[0].category]
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
