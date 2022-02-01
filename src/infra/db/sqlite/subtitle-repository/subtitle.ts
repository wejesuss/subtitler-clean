import { AddSubtitleRepository } from '../../../../data/protocols/add-subtitle-repository'
import { GetSubtitleRepository } from '../../../../data/protocols/get-subtitle-repository'
import { AddSubtitleModel } from '../../../../domain/usecases/add-subtitle'
import { SubtitleModel } from '../../../../domain/models/subtitle'
import { SQLiteHelper } from '../helpers/sqlite-helper'

export class SubtitleSQLiteRepository implements AddSubtitleRepository, GetSubtitleRepository {
  async add (file: AddSubtitleModel): Promise<SubtitleModel> {
    const subtitleData = {
      language: file.language,
      file_id: file.id,
      external_id: file.external_id,
      sent_to_creation: file.sent_to_creation
    }

    const subtitle = await SQLiteHelper.insertOne('subtitles', subtitleData)

    return subtitle
  }

  async get (fileId: string): Promise<SubtitleModel> {
    await SQLiteHelper.getOneWhere('subtitles', { fieldName: 'file_id', id: fileId })

    return await new Promise((resolve) => resolve(null))
  }
}
