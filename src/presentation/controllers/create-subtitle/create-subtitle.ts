import { MissingParamError, NotFoundError } from '../../errors'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  GetFile,
  AddSubtitle,
  GetSubtitle
} from './create-subtitle-protocols'
import { badRequest, notFound, internalServerError, ok } from '../../helpers/http-helper'

export class CreateSubtitleController implements Controller {
  private readonly getFile: GetFile
  private readonly getSubtitle: GetSubtitle
  private readonly addSubtitle: AddSubtitle

  constructor (getFile: GetFile, getSubtitle: GetSubtitle, addSubtitle: AddSubtitle) {
    this.getFile = getFile
    this.getSubtitle = getSubtitle
    this.addSubtitle = addSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body

      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      const file = await this.getFile.get(id)
      if (!file) {
        return notFound(new NotFoundError('file'))
      }

      const subtitle = await this.getSubtitle.get(id)
      if (subtitle) {
        return ok(true)
      }

      await this.addSubtitle.add(file)

      return ok(true)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
