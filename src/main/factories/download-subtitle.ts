import { DownloadSubtitleController } from '../../presentation/controllers/download-subtitle/download-subtitle'
import { DbGetSubtitle } from '../../data/usecases/get-subtitle/db-get-subtitle'
import { ExternalDownloadSubtitle } from '../../data/usecases/download-subtitle/external-download-subtitle'
import { SubtitleSQLiteRepository } from '../../infra/db/sqlite/subtitle-repository/subtitle'
import { CreateVideoLocalStorage } from '../../infra/disk/local/video-from-audio-storage/video'
import { SubtitleYoutubeApiService } from '../../infra/external/youtube-api/subtitle-service/subtitle'
import { LogSQLiteRepository } from '../../infra/db/sqlite/log-repository/log'
import { LogControllerDecorator } from '../decorators/log'
import { OAuth2Client } from 'google-auth-library'
import { Controller } from '../../presentation/protocols'

export const makeDownloadSubtitleController = (inputImage: string, OAuthClient: OAuth2Client): Controller => {
  const subtitleSQLiteRepository = new SubtitleSQLiteRepository()
  const dbGetSubtitle = new DbGetSubtitle(subtitleSQLiteRepository)
  const createVideoFromAudioStorage = new CreateVideoLocalStorage(inputImage)
  const downloadSubtitleService = new SubtitleYoutubeApiService(createVideoFromAudioStorage, OAuthClient)
  const downloadSubtitle = new ExternalDownloadSubtitle(downloadSubtitleService)
  const downloadSubtitleController = new DownloadSubtitleController(dbGetSubtitle, downloadSubtitle)
  const logSQLiteRepository = new LogSQLiteRepository()

  return new LogControllerDecorator(downloadSubtitleController, logSQLiteRepository)
}
