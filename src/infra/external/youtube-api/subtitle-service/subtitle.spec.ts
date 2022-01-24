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

interface SutTypes {
  sut: SubtitleYoutubeApiService
  createVideoFromAudioStub: CreateVideoFromAudioStorage
}

const makeSut = (): SutTypes => {
  const createVideoFromAudioStub = makeCreateVideoFromAudio()
  const sut = new SubtitleYoutubeApiService(createVideoFromAudioStub)

  return {
    sut,
    createVideoFromAudioStub
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
})
