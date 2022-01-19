import { AddSubtitle, AddSubtitleRepository, AddSubtitleModel } from './db-add-subtitle-protocols'

export class DbAddSubtitle implements AddSubtitle {
  private readonly addSubtitleRepository: AddSubtitleRepository

  constructor (addSubtitleRepository: AddSubtitleRepository) {
    this.addSubtitleRepository = addSubtitleRepository
  }

  async add (file: AddSubtitleModel): Promise<boolean> {
    await this.addSubtitleRepository.add(file)
    return await new Promise((resolve) => resolve(null))
  }
}
