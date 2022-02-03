import { Controller, HttpRequest, HttpResponse, GetSubtitle } from './download-subtitle-protocols'

export class DownloadSubtitleController implements Controller {
  private readonly getSubtitle: GetSubtitle

  constructor (getSubtitle: GetSubtitle) {
    this.getSubtitle = getSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.body

    await this.getSubtitle.get(id)
    return await new Promise((resolve) => resolve(null))
  }
}
