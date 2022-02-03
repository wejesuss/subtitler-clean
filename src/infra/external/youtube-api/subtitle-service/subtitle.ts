import fs from 'fs'
import { google, youtube_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import {
  CreateSubtitleService,
  CreateSubtitleModel
} from '../../../../data/protocols/create-subtitle-service'
import { CreateVideoFromAudioStorage } from '../../../../data/protocols/create-video-from-audio-storage'
import { DownloadSubtitleService } from '../../../../data/protocols/download-subtitle-service'
import { CaptionModel } from '../../../../domain/models/caption'

export class SubtitleYoutubeApiService implements CreateSubtitleService, DownloadSubtitleService {
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
    let filePath = ''
    if (mediaData.mimetype.includes('audio/')) {
      filePath = await this.createVideoFromAudio.create(mediaData.path)
    }

    await this.authenticate()

    const youtube = google.youtube({
      version: 'v3',
      auth: this.OAuthClient
    })

    const insertParams: youtube_v3.Params$Resource$Videos$Insert = {
      part: ['id', 'snippet', 'status'],
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: mediaData.filename,
          description: mediaData.filename,
          defaultLanguage: mediaData.language,
          defaultAudioLanguage: mediaData.language
        },
        status: {
          privacyStatus: 'private'
        }
      },
      media: {
        body: fs.createReadStream(filePath || mediaData.path)
      }
    }

    const res = await youtube.videos.insert(insertParams)

    return res.data.id
  }

  async download (externalId: string): Promise<CaptionModel> {
    await this.authenticate()
    return await new Promise((resolve) => resolve(null))
  }
}
