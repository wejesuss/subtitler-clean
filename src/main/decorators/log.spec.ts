import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: { language: 'any_language' }
})

const makeFakeHttpResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'valid_id',
    filename: 'valid_filename',
    path: 'valid_path',
    size: 1073741824
  }
})

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(makeFakeHttpResponse())
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeHttpRequest())
    expect(controllerSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('Should return the same httpResponse as controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(makeFakeHttpResponse())
  })
})
