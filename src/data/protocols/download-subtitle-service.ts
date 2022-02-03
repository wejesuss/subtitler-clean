import { CaptionModel } from '../../domain/models/caption'

export interface DownloadSubtitleService {
  download: (externalId: string) => Promise<CaptionModel>
}
