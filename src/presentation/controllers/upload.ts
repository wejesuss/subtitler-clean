import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../errors/invalid-param-error'
import { LanguageValidator } from '../protocols/language-validator'
import { FileValidator } from '../protocols/file-validator'

export class UploadController implements Controller {
  private readonly languageValidator: LanguageValidator
  private readonly fileValidator: FileValidator

  constructor (languageValidator: LanguageValidator, fileValidator: FileValidator) {
    this.languageValidator = languageValidator
    this.fileValidator = fileValidator
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
    }

    const isFileValid = this.fileValidator.isValid(file)
    if (!isFileValid) {
      return badRequest(new InvalidParamError('file'))
    }

    return {
      statusCode: 200
    }
  }
}
