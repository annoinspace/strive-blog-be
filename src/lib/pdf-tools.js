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
      { text: "blogs", style: "header" },
      blogsArray.map((blog) => {
        return [
          {
            text: blog.title
          },
          {
            text: blog.author.name
          }
        ]
      })
    ],
    styles: {
      header: {
        fontSize: 48
      }
    }
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
