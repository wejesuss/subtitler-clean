import { FileValidator } from '../../utils/files/fileValidator'
import { GetLanguages } from '../../utils/languages/getLanguages'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'

export class UploadController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body, file } = httpRequest

    if (!body.language) {
      return {
        statusCode: 400,
        body: new MissingParamError('language')
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
        body: new MissingParamError('file')
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
