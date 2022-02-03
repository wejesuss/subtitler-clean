/* eslint-disable import/first */
const mockInsert = jest.fn().mockImplementation(async (params) => {
  return await new Promise((resolve) =>
    resolve({
      data: {
        id: 'valid_video_id'
      }
    })
  )
})

const mockCaptionsList = jest.fn().mockImplementation(async (params) => {
  return await new Promise((resolve) =>
    resolve({
      data: {
        items: [
          {
            id: 'valid_caption_id',
            snippet: {
              isDraft: false,
              status: 'serving'
            }
          }
        ]
      }
    })
  )
})

const mockCaptionsDownload = jest.fn().mockImplementation(async (params) => {
  return await new Promise((resolve) =>
    resolve({
      data: 'any_timed_captions'
    })
  )
})

const mockYoutube = jest.fn().mockImplementation(() => {
  return {
    videos: {
      insert: mockInsert
    },
    captions: {
      list: mockCaptionsList,
      download: mockCaptionsDownload
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
const mockCreateReadStream = jest.fn()

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
    createReadStream: mockCreateReadStream
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

const makeFakeInsertParams = (
  mediaData: CreateSubtitleModel
): youtube_v3.Params$Resource$Videos$Insert => ({
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
  const sut = new SubtitleYoutubeApiService(
    createVideoFromAudioStub,
    OAuthClient
  )

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
    const includesSpy = jest
      .spyOn(String.prototype, 'includes')
      .mockReturnValueOnce(true)

    await sut.create(makeMediaData())

    expect(includesSpy).toHaveBeenCalledWith('audio/')
    expect(createVideoSpy).toHaveBeenCalledWith('any_path')
  })

  test('Should throw if CreateVideoFromAudio throws', async () => {
    const { sut, createVideoFromAudioStub } = makeSut()
    jest.spyOn(String.prototype, 'includes').mockReturnValueOnce(true)
    jest
      .spyOn(createVideoFromAudioStub, 'create')
      .mockImplementationOnce(async () => {
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

  test('Should throw if google.youtube throws', async () => {
    const { sut } = makeSut()
    mockYoutube.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.create(makeMediaData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call youtube insert with correct values', async () => {
    const { sut } = makeSut()

    const mediaData = makeMediaData()
    const insertParams = makeFakeInsertParams(mediaData)

    await sut.create(mediaData)

    expect(mockInsert).toHaveBeenCalledWith(insertParams)
  })

  test('Should throw if youtube insert throws', async () => {
    const { sut } = makeSut()
    mockInsert.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.create(makeMediaData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call youtube insert with new file path if CreateVideoFromAudio was called', async () => {
    const { sut, createVideoFromAudioStub } = makeSut()
    jest.spyOn(String.prototype, 'includes').mockReturnValueOnce(true)
    jest.spyOn(createVideoFromAudioStub, 'create')

    const mediaData = makeMediaData()
    const insertParams = makeFakeInsertParams({
      ...mediaData,
      path: 'any_video_path'
    })

    await sut.create(mediaData)

    expect(mockInsert).toHaveBeenCalledWith(insertParams)
    expect(mockCreateReadStream).toHaveBeenNthCalledWith(2, 'any_video_path')
  })

  test('Should return video id on success', async () => {
    const { sut } = makeSut()

    const mediaData = makeMediaData()

    const id = await sut.create(mediaData)

    expect(id).toBe('valid_video_id')
  })

  test('Should authenticate before downloading captions', async () => {
    const { sut } = makeSut()

    await sut.download('any_id')

    expect(mockGetAccessToken).toHaveBeenCalledTimes(1)
    expect(mockSetCredentials).toHaveBeenCalledTimes(1)
  })

  test('Should throw if authenticate throws', async () => {
    const { sut } = makeSut()
    mockGetAccessToken.mockImplementationOnce(() => {
      throw new Error()
    })

    let promise = sut.download('any_id')
    await expect(promise).rejects.toThrow()

    mockSetCredentials.mockImplementationOnce(() => {
      throw new Error()
    })

    promise = sut.download('any_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should create youtube service object before downloading captions', async () => {
    const { sut, OAuthClient } = makeSut()

    await sut.download('any_id')

    expect(mockYoutube).toHaveBeenCalledWith({
      version: 'v3',
      auth: OAuthClient
    })
  })

  test('Should throw if google.youtube throws', async () => {
    const { sut } = makeSut()
    mockYoutube.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.download('any_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call youtube captions list with correct values', async () => {
    const { sut } = makeSut()

    const id = 'any_id'
    const captionsListParams = {
      part: ['id', 'snippet'],
      videoId: id
    }

    await sut.download(id)

    expect(mockCaptionsList).toHaveBeenCalledWith(captionsListParams)
  })

  test('Should throw if youtube captions list throws', async () => {
    const { sut } = makeSut()
    mockCaptionsList.mockImplementationOnce(() => {
      throw new Error()
    })

    const id = 'any_id'
    const promise = sut.download(id)

    await expect(promise).rejects.toThrow()
  })

  test('Should return falsy if no caption is found', async () => {
    const { sut } = makeSut()
    mockCaptionsList.mockReturnValueOnce(new Promise((resolve) => resolve({
      data: {
        items: []
      }
    })))

    const id = 'any_id'
    const caption = await sut.download(id)

    expect(caption).toBeFalsy()
  })

  test('Should call youtube captions download with correct values', async () => {
    const { sut } = makeSut()

    const id = 'any_id'
    const captionsDownloadParams = {
      id: 'valid_caption_id',
      tfmt: 'srt'
    }

    await sut.download(id)

    expect(mockCaptionsDownload).toHaveBeenCalledWith(captionsDownloadParams)
  })

  test('Should not call youtube captions download if caption is not available', async () => {
    const { sut } = makeSut()
    mockCaptionsList.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'any_id',
            snippet: {
              isDraft: true,
              status: 'syncing'
            }
          }
        ]
      }
    })

    const id = 'any_id'
    await sut.download(id)

    expect(mockCaptionsDownload).toHaveBeenCalledTimes(0)
  })
})
