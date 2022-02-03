import { DownloadSubtitleController } from './download-subtitle'
import { HttpRequest, GetSubtitle, SubtitleModel } from './download-subtitle-protocols'
import { badRequest, internalServerError, notFound } from '../../helpers/http-helper'
import { MissingParamError, NotFoundError, ServerError } from '../../errors'

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
  test('Should return 400 if id is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = { body: {} }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  test('Should call GetSubtitle with correct value', async () => {
    const { sut, getSubtitleStub } = makeSut()
    const getSubtitleSpy = jest.spyOn(getSubtitleStub, 'get')

    await sut.handle(makeFakeHttpRequest())

    expect(getSubtitleSpy).toHaveBeenCalledWith('any_file_id')
  })

  test('Should return 404 if subtitle is not found', async () => {
    const { sut, getSubtitleStub } = makeSut()
    jest.spyOn(getSubtitleStub, 'get').mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(notFound(new NotFoundError('subtitle')))
  })

  test('Should return 500 if GetSubtitle throws', async () => {
    const { sut, getSubtitleStub } = makeSut()
    jest.spyOn(getSubtitleStub, 'get').mockImplementationOnce(async () => {
      throw new Error('')
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })
})
