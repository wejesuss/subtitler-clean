import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, notFound } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { GetFile } from '../../../domain/usecases/get-file'
import { CreateSubtitle } from '../../../domain/usecases/create-subtitle'
import { NotFoundError } from '../../errors/not-found-error'

export class CreateSubtitleController implements Controller {
  private readonly getFile: GetFile
  private readonly createSubtitle: CreateSubtitle

  constructor (getFile: GetFile, createSubtitle: CreateSubtitle) {
    this.getFile = getFile
    this.createSubtitle = createSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.id) {
      return badRequest(new MissingParamError('id'))
    }
    const file = await this.getFile.get(httpRequest.body.id)
    if (!file) {
      return notFound(new NotFoundError('file'))
    }

    await this.createSubtitle.create({
      filename: file.filename,
      path: file.path,
      size: file.size
    })
  }
}
