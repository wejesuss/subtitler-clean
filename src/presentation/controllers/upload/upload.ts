import {
  HttpRequest,
  HttpResponse,
  Controller,
  FileValidator,
  LanguageValidator,
  AddFile
} from './upload-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, internalServerError, ok } from '../../helpers/http-helper'

export class UploadController implements Controller {
  private readonly languageValidator: LanguageValidator
  private readonly fileValidator: FileValidator
  private readonly addFile: AddFile

  constructor (languageValidator: LanguageValidator, fileValidator: FileValidator, addFile: AddFile) {
    this.languageValidator = languageValidator
    this.fileValidator = fileValidator
    this.addFile = addFile
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

      const fileModel = this.addFile.add({
        filename: file.filename,
        path: file.path,
        size: file.size
      })

      return ok(fileModel)
    } catch (error) {
      console.error(error)
      return internalServerError()
    }
  }
}
