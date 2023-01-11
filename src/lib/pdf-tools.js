import PdfPrinter from "pdfmake"

export const getPDFReadableStream = (blogsArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica"
    }
  }
  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    content: [
      blogsArray.map((blog) => {
        return [
          {
            text: blog.title
          },
          {
            text: blog.category
          }
        ]
      })
    ]
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
