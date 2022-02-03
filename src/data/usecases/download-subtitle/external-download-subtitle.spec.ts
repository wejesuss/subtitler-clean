import { CaptionModel } from '../../../domain/models/caption'
import { DownloadSubtitleService } from '../../protocols/download-subtitle-service'
import { ExternalDownloadSubtitle } from './external-download-subtitle'

const makeFakeCaptionModel = (): CaptionModel => ({
  isReady: true,
  captions: 'any_timed_captions'
})

const makeDownloadSubtitleService = (): DownloadSubtitleService => {
  class DownloadSubtitleServiceStub implements DownloadSubtitleService {
    async download (externalId: string): Promise<CaptionModel> {
      return await new Promise((resolve) => resolve(makeFakeCaptionModel()))
    }
  }

  return new DownloadSubtitleServiceStub()
}

interface SutTypes {
  sut: ExternalDownloadSubtitle
  downloadSubtitleServiceStub: DownloadSubtitleService
}

const makeSut = (): SutTypes => {
  const downloadSubtitleServiceStub = makeDownloadSubtitleService()
  const sut = new ExternalDownloadSubtitle(downloadSubtitleServiceStub)

  return {
    sut,
    downloadSubtitleServiceStub
  }
}

describe('ExternalDownloadSubtitle Usecase', () => {
  test('Should call DownloadSubtitleService with correct value', async () => {
    const { sut, downloadSubtitleServiceStub } = makeSut()
    const downloadSubtitleServiceSpy = jest.spyOn(downloadSubtitleServiceStub, 'download')
    const id = 'any_external_id'

    await sut.download(id)

    expect(downloadSubtitleServiceSpy).toHaveBeenCalledWith(id)
  })
})
