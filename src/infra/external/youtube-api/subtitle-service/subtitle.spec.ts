/* eslint-disable import/first */
const mockYoutube = jest.fn().mockImplementation(() => {
  return {
    videos: {
      insert: mockInsert
    }
  }
})
const mockInsert = jest.fn().mockImplementation((params) => {
  return {}
})
const mockGenerateAuthUrl = jest.fn().mockImplementation(() => {
  return 'auth_url'
})
const mockGetAccessToken = jest.fn().mockImplementation(() => {
  return { token: 'access_token' }
})
let mockCredentials = {}
const mockSetCredentials = jest.fn().mockImplementation((credentials) => {
  mockCredentials = credentials
})

jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockImplementation(() => {
          return {
            credentials: mockCredentials,
            generateAuthUrl: mockGenerateAuthUrl,
            getAccessToken: mockGetAccessToken,
            setCredentials: mockSetCredentials
          }
        })
      },
      youtube: mockYoutube
    }
  }
})
jest.mock('fs', () => {
  return {
    createReadStream: jest.fn()
  }
})

import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { SubtitleYoutubeApiService } from './subtitle'
import { CreateVideoFromAudioStorage } from '../../../../data/protocols/create-video-from-audio-storage'
import { CreateSubtitleModel } from '../../../../data/protocols/create-subtitle-service'

const makeMediaData = (): CreateSubtitleModel => ({
  mimetype: 'any_mimetype',
  language: 'any_language',
  filename: 'any_filename',
  path: 'any_path'
})

const makeCreateVideoFromAudio = (): CreateVideoFromAudioStorage => {
  class CreateVideoFromAudioStub implements CreateVideoFromAudioStorage {
    async create (path: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_video_path'))
    }
  }

  return new CreateVideoFromAudioStub()
}

const makeOAuthClient = (): OAuth2Client => {
  const OAuthClient = new google.auth.OAuth2()
  OAuthClient.generateAuthUrl()

  return OAuthClient
}

interface SutTypes {
  sut: SubtitleYoutubeApiService
  createVideoFromAudioStub: CreateVideoFromAudioStorage
  OAuthClient: OAuth2Client
}

const makeSut = (): SutTypes => {
  const createVideoFromAudioStub = makeCreateVideoFromAudio()
  const OAuthClient = makeOAuthClient()
  const sut = new SubtitleYoutubeApiService(createVideoFromAudioStub, OAuthClient)

  return {
    sut,
    createVideoFromAudioStub,
    OAuthClient
  }
}

describe('SubtitleYoutubeApiService', () => {
  test('Should not call CreateVideoFromAudio if file mimetype not refers to an audio', async () => {
    const { sut, createVideoFromAudioStub } = makeSut()
    const createVideoSpy = jest.spyOn(createVideoFromAudioStub, 'create')
    const includesSpy = jest.spyOn(String.prototype, 'includes')

    await sut.create(makeMediaData())

    expect(includesSpy).toHaveBeenCalledWith('audio/')
    expect(createVideoSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call CreateVideoFromAudio if file mimetype refers to an audio', async () => {
    const { sut, createVideoFromAudioStub } = makeSut()
    const createVideoSpy = jest.spyOn(createVideoFromAudioStub, 'create')
    const includesSpy = jest.spyOn(String.prototype, 'includes').mockReturnValueOnce(true)

    await sut.create(makeMediaData())

    expect(includesSpy).toHaveBeenCalledWith('audio/')
    expect(createVideoSpy).toHaveBeenCalledWith('any_path')
  })

  test('Should authenticate before sending file', async () => {
    const { sut } = makeSut()

    await sut.create(makeMediaData())

    expect(mockGetAccessToken).toHaveBeenCalledTimes(1)
    expect(mockSetCredentials).toHaveBeenCalledTimes(1)
  })

  test('Should create youtube service object before sending file', async () => {
    const { sut, OAuthClient } = makeSut()

    await sut.create(makeMediaData())

    expect(mockYoutube).toHaveBeenCalledWith({
      version: 'v3',
      auth: OAuthClient
    })
  })
})
