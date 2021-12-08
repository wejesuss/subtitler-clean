import { FileValidator } from '../../utils/files/fileValidator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../errors/invalid-param-error'
import { LanguageValidator } from '../protocols/language-validator'

export class UploadController implements Controller {
  private readonly languageValidator: LanguageValidator

  constructor (languageValidator: LanguageValidator) {
    this.languageValidator = languageValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const { body, file } = httpRequest

    if (!body.language) {
      return badRequest(new MissingParamError('language'))
    }

    const isLanguageValid = this.languageValidator.isValid(body.language)
    if (!isLanguageValid) {
      return badRequest(new InvalidParamError('language'))
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
