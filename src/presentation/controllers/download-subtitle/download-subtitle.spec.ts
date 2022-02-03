import { DownloadSubtitleController } from './download-subtitle'
import { GetSubtitle } from '../../../domain/usecases/get-subtitle'
import { SubtitleModel } from '../../../domain/models/subtitle'
import { HttpRequest } from '../../protocols'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    id: 'any_file_id'
  }
})

const makeFakeSubtitleModel = (): SubtitleModel => ({
  id: 'any_id',
  language: 'any_language',
  sent_to_creation: true,
  file_id: 'any_file_id',
  external_id: 'any_external_id'
})

const makeGetSubtitle = (): GetSubtitle => {
  class GetSubtitleStub implements GetSubtitle {
    async get (fileId: string): Promise<SubtitleModel> {
      return await new Promise((resolve) => resolve(makeFakeSubtitleModel()))
    }
  }

  return new GetSubtitleStub()
}

interface SutTypes {
  sut: DownloadSubtitleController
  getSubtitleStub: GetSubtitle
}

const makeSut = (): SutTypes => {
  const getSubtitleStub = makeGetSubtitle()
  const sut = new DownloadSubtitleController(getSubtitleStub)

  return {
    sut,
    getSubtitleStub
  }
}

describe('Download Subtitle Controller', () => {
  test('Should call GetSubtitle with correct value', async () => {
    const { sut, getSubtitleStub } = makeSut()
    const getSubtitleSpy = jest.spyOn(getSubtitleStub, 'get')

    await sut.handle(makeFakeHttpRequest())

    expect(getSubtitleSpy).toHaveBeenCalledWith('any_file_id')
  })
})
