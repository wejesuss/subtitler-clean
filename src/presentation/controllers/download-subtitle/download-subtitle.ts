import { Controller, HttpRequest, HttpResponse, GetSubtitle } from './download-subtitle-protocols'
import { MissingParamError, NotFoundError } from '../../errors'
import { badRequest, internalServerError, notFound } from '../../helpers/http-helper'

export class DownloadSubtitleController implements Controller {
  private readonly getSubtitle: GetSubtitle

  constructor (getSubtitle: GetSubtitle) {
    this.getSubtitle = getSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      await this.getSubtitle.get(id)
      return notFound(new NotFoundError('subtitle'))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
