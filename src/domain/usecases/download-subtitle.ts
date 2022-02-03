import { CaptionModel } from '../models/caption'

export interface DownloadSubtitle {
  download: (externalId: string) => Promise<CaptionModel>
}
