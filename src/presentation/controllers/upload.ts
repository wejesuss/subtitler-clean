export class UploadController {
  handle (httpRequest: any): any {
    if (!httpRequest.body.language) {
      return {
        statusCode: 400,
        body: new Error('No language provided')
      }
    }
  }
}
