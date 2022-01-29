import {
  CreateSubtitleService,
  CreateSubtitleModel
} from '../../../../data/protocols/create-subtitle-service'
import { CreateVideoFromAudioStorage } from '../../../../data/protocols/create-video-from-audio-storage'
import { OAuth2Client } from 'google-auth-library'

export class SubtitleYoutubeApiService implements CreateSubtitleService {
  private readonly createVideoFromAudio: CreateVideoFromAudioStorage
  private readonly OAuthClient: OAuth2Client

  constructor (
    createVideoFromAudio: CreateVideoFromAudioStorage,
    OAuthClient: OAuth2Client
  ) {
    this.createVideoFromAudio = createVideoFromAudio
    this.OAuthClient = OAuthClient
  }

  private async authenticate (): Promise<void> {
    const { token } = await this.OAuthClient.getAccessToken()
    this.OAuthClient.setCredentials({
      ...this.OAuthClient.credentials,
      access_token: token
    })
  }

  async create (mediaData: CreateSubtitleModel): Promise<string> {
    if (mediaData.mimetype.includes('audio/')) {
      await this.createVideoFromAudio.create(mediaData.path)
    }

    await this.authenticate()

    return await new Promise((resolve) => resolve(null))
  }
}
