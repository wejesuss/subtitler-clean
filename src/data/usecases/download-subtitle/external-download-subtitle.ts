import { DownloadSubtitle, CaptionModel, DownloadSubtitleService } from './external-download-subtitle-protocols'

export class ExternalDownloadSubtitle implements DownloadSubtitle {
  private readonly downloadSubtitleService: DownloadSubtitleService

  constructor (downloadSubtitleService: DownloadSubtitleService) {
    this.downloadSubtitleService = downloadSubtitleService
  }

  async download (externalId: string): Promise<CaptionModel> {
    return await this.downloadSubtitleService.download(externalId)
  }
}
