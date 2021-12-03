export class UploadController {
  handle (httpRequest: any): any {
    const { body, file } = httpRequest

    if (!body.language) {
      return {
        statusCode: 400,
        body: new Error('No language provided')
      }
    }

    if (!file) {
      return {
        statusCode: 400,
        body: new Error('No file information provided')
      }
    }
  }
}
