import { MissingParamError, NotFoundError } from '../../errors'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  GetFile,
  AddSubtitle,
  GetSubtitle,
  CreateSubtitle
} from './create-subtitle-protocols'
import { badRequest, notFound, internalServerError, ok } from '../../helpers/http-helper'

export class CreateSubtitleController implements Controller {
  private readonly getFile: GetFile
  private readonly getSubtitle: GetSubtitle
  private readonly createSubtitle: CreateSubtitle
  private readonly addSubtitle: AddSubtitle

  constructor (getFile: GetFile, getSubtitle: GetSubtitle, createSubtitle: CreateSubtitle, addSubtitle: AddSubtitle) {
    this.getFile = getFile
    this.getSubtitle = getSubtitle
    this.createSubtitle = createSubtitle
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

      let subtitle = await this.getSubtitle.get(id)
      if (subtitle) {
        return ok(subtitle)
      }

      const addSubtitleModel = await this.createSubtitle.create(file)
      subtitle = await this.addSubtitle.add(addSubtitleModel)

      return ok(subtitle)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
