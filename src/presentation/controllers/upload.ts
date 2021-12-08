import { FileValidator } from '../../utils/files/fileValidator'
import { GetLanguages } from '../../utils/languages/getLanguages'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class UploadController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body, file } = httpRequest

    if (!body.language) {
      return badRequest(new MissingParamError('language'))
    } else {
      const getLanguages = new GetLanguages()
      const nameOrError = getLanguages.verify(body.language)
      if (nameOrError instanceof Error) {
        return badRequest(new Error('No valid language provided'))
      }
    }

    if (!file) {
      return badRequest(new MissingParamError('file'))
    } else {
      const fileValidator = new FileValidator()
      const fileOrError = fileValidator.verify(file)
      if (fileOrError instanceof Error) {
        return badRequest(fileOrError)
      }
    }

    return {
      statusCode: 200
    }
  }
}
