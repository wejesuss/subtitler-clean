import { CreateSubtitleController } from '../../presentation/controllers/create-subtitle/create-subtitle'
import { FileSQLiteRepository } from '../../infra/db/sqlite/file-repository/file'
import { SubtitleSQLiteRepository } from '../../infra/db/sqlite/subtitle-repository/subtitle'
import { CreateVideoLocalStorage } from '../../infra/disk/local/video-from-audio-storage/video'
import { SubtitleYoutubeApiService } from '../../infra/external/youtube-api/subtitle-service/subtitle'
import { LogSQLiteRepository } from '../../infra/db/sqlite/log-repository/log'
import { DbGetFile } from '../../data/usecases/get-file/db-get-file'
import { DbGetSubtitle } from '../../data/usecases/get-subtitle/db-get-subtitle'
import { ExternalCreateSubtitle } from '../../data/usecases/create-subtitle/external-create-subtitle'
import { DbAddSubtitle } from '../../data/usecases/add-subtitle/db-add-subtitle'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'
import { OAuth2Client } from 'google-auth-library'

export const makeCreateSubtitleController = (inputImage: string, OAuthClient: OAuth2Client): Controller => {
  const fileSQLiteRepository = new FileSQLiteRepository()
  const subtitleSQLiteRepository = new SubtitleSQLiteRepository()
  const createVideoFromAudioStorage = new CreateVideoLocalStorage(inputImage)
  const createSubtitleService = new SubtitleYoutubeApiService(createVideoFromAudioStorage, OAuthClient)
  const getFile = new DbGetFile(fileSQLiteRepository)
  const getSubtitle = new DbGetSubtitle(subtitleSQLiteRepository)
  const createSubtitle = new ExternalCreateSubtitle(createSubtitleService)
  const addSubtitle = new DbAddSubtitle(subtitleSQLiteRepository)
  const createSubtitleController = new CreateSubtitleController(getFile, getSubtitle, createSubtitle, addSubtitle)
  const logSQLiteRepository = new LogSQLiteRepository()

  return new LogControllerDecorator(createSubtitleController, logSQLiteRepository)
}
