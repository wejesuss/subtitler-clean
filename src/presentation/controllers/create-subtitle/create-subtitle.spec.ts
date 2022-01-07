import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { CreateSubtitleController } from './create-subtitle'

describe('Create Subtitle Controller', () => {
  test('Should return 400 if no file id is provided', async () => {
    const sut = new CreateSubtitleController()
    const httpRequest = {
      body: {
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })
})
