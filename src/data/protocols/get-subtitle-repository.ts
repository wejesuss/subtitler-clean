import { SubtitleModel } from '../../domain/models/subtitle'

export interface GetSubtitleRepository {
  get: (fileId: string) => Promise<SubtitleModel>
}
