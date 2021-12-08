import { FileValidator } from '../../utils/files/fileValidator'
import { GetLanguages } from '../../utils/languages/getLanguages'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class UploadController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body, file } = httpRequest

    if (!body.language) {
      return {
        statusCode: 400,
        body: new Error('No language provided')
      }
    }

    const getLanguages = new GetLanguages()
    const nameOrError = getLanguages.verify(body.language)
    if (nameOrError instanceof Error) {
      return {
        statusCode: 400,
        body: new Error('No valid language provided')
      }
    }

    if (!file) {
      return {
        statusCode: 400,
        body: new Error('No file information provided')
      }
    }

    const fileValidator = new FileValidator()
    const fileOrError = fileValidator.verify(file)
    if (fileOrError instanceof Error) {
      return {
        statusCode: 400,
        body: fileOrError
      }
    }

    return {
      statusCode: 200
    }
  }
}
