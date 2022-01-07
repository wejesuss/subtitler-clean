import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { GetFile } from '../../../domain/usecases/get-file'

export class CreateSubtitleController implements Controller {
  private readonly getFile: GetFile

  constructor (getFile: GetFile) {
    this.getFile = getFile
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.id) {
      return badRequest(new MissingParamError('id'))
    }

    await this.getFile.get(httpRequest.body.id)

    return {
      statusCode: 404,
      body: new Error('Not found: resource file not found')
    }
  }
}
