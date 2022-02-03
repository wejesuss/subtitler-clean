import { Controller, HttpRequest, HttpResponse, GetSubtitle, DownloadSubtitle } from './download-subtitle-protocols'
import { MissingParamError, NotFoundError } from '../../errors'
import { badRequest, internalServerError, notFound } from '../../helpers/http-helper'

export class DownloadSubtitleController implements Controller {
  private readonly getSubtitle: GetSubtitle
  private readonly downloadSubtitle: DownloadSubtitle

  constructor (getSubtitle: GetSubtitle, downloadSubtitle: DownloadSubtitle) {
    this.getSubtitle = getSubtitle
    this.downloadSubtitle = downloadSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      const subtitle = await this.getSubtitle.get(id)
      if (!subtitle) {
        return notFound(new NotFoundError('subtitle'))
      }

      await this.downloadSubtitle.download(subtitle.external_id)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
