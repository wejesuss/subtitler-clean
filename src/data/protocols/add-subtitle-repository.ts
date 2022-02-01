import { SubtitleModel } from '../../domain/models/subtitle'
import { AddSubtitleModel } from '../../domain/usecases/add-subtitle'

export interface AddSubtitleRepository {
  add: (file: AddSubtitleModel) => Promise<SubtitleModel>
}
