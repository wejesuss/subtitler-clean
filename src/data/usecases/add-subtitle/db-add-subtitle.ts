import { AddSubtitle, AddSubtitleRepository, AddSubtitleModel, SubtitleModel } from './db-add-subtitle-protocols'

export class DbAddSubtitle implements AddSubtitle {
  private readonly addSubtitleRepository: AddSubtitleRepository

  constructor (addSubtitleRepository: AddSubtitleRepository) {
    this.addSubtitleRepository = addSubtitleRepository
  }

  async add (file: AddSubtitleModel): Promise<SubtitleModel> {
    return await this.addSubtitleRepository.add(file)
  }
}
