import PdfPrinter from "pdfmake"

export const getPDFReadableStream = (blogsArray) => {
  //   console.log(blogsArray)
  const fonts = {
    Roboto: {
      normal: "Helvetica"
    }
  }

  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    content:
      //  blogsArray.map((blog) => {
      //   return [
      //     {
      //       text: blog.title
      //     }
      //   ]
      // }),
      [
        { text: "This is a header", style: "header" },
        blogsArray.map((blog) => {
          return [
            {
              text: blog.title
            }
          ]
        })
        //   return [text: blogPost[0].title, blogPost[0].category, blogPost[0].price]
        //   blogsArray.forEach((blogPost) => {
        //     return [blogPost.title, blogPost.category, blogPost.price]
        //   })
      ],
    styles: {
      // does not work for undefinable reasons
      header: {
        fontSize: 48
      }
    }
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
