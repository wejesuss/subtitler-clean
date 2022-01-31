/* eslint-disable import/first */
const mockInsert = jest.fn().mockImplementation(async (params) => {
  return await new Promise((resolve) => resolve({
    data: {
      id: 'valid_video_id'
    }
  }))
})
const mockYoutube = jest.fn().mockImplementation(() => {
  return {
    videos: {
      insert: mockInsert
    }
  }
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

import fs from 'fs'
import { google, youtube_v3 } from 'googleapis'
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

const makeFakeInsertParams = (mediaData: CreateSubtitleModel): youtube_v3.Params$Resource$Videos$Insert => ({
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
    body: fs.createReadStream(mediaData.path)
  }
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

  test('Should throw if CreateVideoFromAudio throws', async () => {
    const { sut, createVideoFromAudioStub } = makeSut()
    jest.spyOn(String.prototype, 'includes').mockReturnValueOnce(true)
    jest.spyOn(createVideoFromAudioStub, 'create').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.create(makeMediaData())

    await expect(promise).rejects.toThrow()
  })

  test('Should authenticate before sending file', async () => {
    const { sut } = makeSut()

    await sut.create(makeMediaData())

    expect(mockGetAccessToken).toHaveBeenCalledTimes(1)
    expect(mockSetCredentials).toHaveBeenCalledTimes(1)
  })

  test('Should throw if authenticate throws', async () => {
    const { sut } = makeSut()
    mockGetAccessToken.mockImplementationOnce(() => {
      throw new Error()
    })

    let promise = sut.create(makeMediaData())
    await expect(promise).rejects.toThrow()

    mockSetCredentials.mockImplementationOnce(() => {
      throw new Error()
    })

    promise = sut.create(makeMediaData())
    await expect(promise).rejects.toThrow()
  })

  test('Should create youtube service object before sending file', async () => {
    const { sut, OAuthClient } = makeSut()

    await sut.create(makeMediaData())

    expect(mockYoutube).toHaveBeenCalledWith({
      version: 'v3',
      auth: OAuthClient
    })
  })

  test('Should call youtube insert with correct values', async () => {
    const { sut } = makeSut()

    const mediaData = makeMediaData()
    const insertParams = makeFakeInsertParams(mediaData)

    await sut.create(mediaData)

    expect(mockInsert).toHaveBeenCalledWith(insertParams)
  })

  test('Should return video id on success', async () => {
    const { sut } = makeSut()

    const mediaData = makeMediaData()

    const id = await sut.create(mediaData)

    expect(id).toBe('valid_video_id')
  })
})
