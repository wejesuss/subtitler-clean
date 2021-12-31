import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  test('Should call controller with correct values', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return await Promise.resolve(null)
      }
    }

    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const controllerSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle({
      body: {
        language: 'any_language'
      }
    })

    expect(controllerSpy).toHaveBeenCalledWith({
      body: {
        language: 'any_language'
      }
    })
  })
})
