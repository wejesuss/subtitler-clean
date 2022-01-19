
import { AddSubtitleModel } from '../../../domain/usecases/add-subtitle'
import { CreateSubtitle, FileModel, CreateSubtitleService } from './external-create-subtitle-protocols'

export class ExternalCreateSubtitle implements CreateSubtitle {
  private readonly createSubtitleService: CreateSubtitleService

  constructor (createSubtitleService: CreateSubtitleService) {
    this.createSubtitleService = createSubtitleService
  }

  async create (file: FileModel): Promise<AddSubtitleModel> {
    await this.createSubtitleService.create({
      mimetype: file.mimetype,
      language: file.language,
      filename: file.filename,
      path: file.path
    })

    return await new Promise((resolve) => resolve(null))
  }
}
