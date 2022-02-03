import { NotFoundError } from '../../errors'
import { internalServerError, notFound } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, GetSubtitle } from './download-subtitle-protocols'

export class DownloadSubtitleController implements Controller {
  private readonly getSubtitle: GetSubtitle

  constructor (getSubtitle: GetSubtitle) {
    this.getSubtitle = getSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body
      await this.getSubtitle.get(id)
      return notFound(new NotFoundError('subtitle'))
    } catch (error) {
      return internalServerError(error)
    }
  }
}
