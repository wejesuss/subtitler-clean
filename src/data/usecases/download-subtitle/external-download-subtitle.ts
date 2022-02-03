import { DownloadSubtitle } from '../../../domain/usecases/download-subtitle'
import { CaptionModel } from '../../../domain/models/caption'
import { DownloadSubtitleService } from '../../protocols/download-subtitle-service'

export class ExternalDownloadSubtitle implements DownloadSubtitle {
  private readonly downloadSubtitleService: DownloadSubtitleService

  constructor (downloadSubtitleService: DownloadSubtitleService) {
    this.downloadSubtitleService = downloadSubtitleService
  }

  async download (externalId: string): Promise<CaptionModel> {
    await this.downloadSubtitleService.download(externalId)

    return await new Promise((resolve) => resolve(null))
  }
}
