import {
  HttpRequest,
  HttpResponse,
  Controller
} from '../protocols'
import { FileValidator } from '../protocols/file-validator'
import { LanguageValidator } from '../protocols/language-validator'
import {
  MissingParamError,
  InvalidParamError
} from '../errors'
import { badRequest, internalServerError, ok } from '../helpers/http-helper'

export class UploadController implements Controller {
  private readonly languageValidator: LanguageValidator
  private readonly fileValidator: FileValidator

  constructor (languageValidator: LanguageValidator, fileValidator: FileValidator) {
    this.languageValidator = languageValidator
    this.fileValidator = fileValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
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

      return ok()
    } catch (error) {
      console.error(error)
      return internalServerError()
    }
  }
}
