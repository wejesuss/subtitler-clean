import { SubtitleModel, GetSubtitle, GetSubtitleRepository } from './db-get-subtitle-protocols'

export class DbGetSubtitle implements GetSubtitle {
  private readonly getSubtitleRepository: GetSubtitleRepository

  constructor (getSubtitleRepository: GetSubtitleRepository) {
    this.getSubtitleRepository = getSubtitleRepository
  }

  async get (fileId: string): Promise<SubtitleModel> {
    return await this.getSubtitleRepository.get(fileId)
  }
}
