import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { internalServerError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
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

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
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

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = internalServerError(fakeError)

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(error)))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(error)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
