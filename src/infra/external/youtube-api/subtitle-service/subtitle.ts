import { CreateSubtitleService, CreateSubtitleModel } from '../../../../data/protocols/create-subtitle-service'
import { CreateVideoFromAudioStorage } from '../../../../data/protocols/create-video-from-audio-storage'

export class SubtitleYoutubeApiService implements CreateSubtitleService {
  private readonly createVideoFromAudio: CreateVideoFromAudioStorage

  constructor (createVideoFromAudio: CreateVideoFromAudioStorage) {
    this.createVideoFromAudio = createVideoFromAudio
  }

  async create (mediaData: CreateSubtitleModel): Promise<string> {
    if (mediaData.mimetype.includes('audio/')) {
      await this.createVideoFromAudio.create(mediaData.path)
    }
    return await new Promise((resolve) => resolve(null))
  }
}
