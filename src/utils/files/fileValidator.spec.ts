import path from 'path'

import { FileValidator } from './fileValidator'

describe('FileValidator', () => {
  test('Should return an error if no valid file mimetype is provided', () => {
    const file = {
      mimetype: 'image/jpg',
      size: 1048576,
      destination: path.resolve(__dirname),
      filename: 'input.jpg',
      path: path.resolve(__dirname, 'input.jpg'),
      buffer: Buffer.from([23, 31, 124, 53])
    }

    const sut = new FileValidator()
    const fileOrError = sut.verify(file)
    const err = new Error('No valid file information provided')
    err.name = 'mimetype'

    expect(fileOrError).toEqual(err)
    expect(fileOrError).toHaveProperty('name', err.name)
  })
})
