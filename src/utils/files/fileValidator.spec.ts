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

  test('Should return an error if file size is too big', () => {
    const greaterThan1GigaByte = (1073741824 + 1)

    const file = {
      mimetype: 'video/mp4',
      size: greaterThan1GigaByte,
      destination: path.resolve(__dirname),
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4')
    }

    const sut = new FileValidator()
    const fileOrError = sut.verify(file)
    const err = new Error('No valid file information provided')
    err.name = 'size'

    expect(fileOrError).toEqual(err)
    expect(fileOrError).toHaveProperty('name', err.name)
  })

  test('Should return the appropriate error name property', () => {
    const greaterThan1GigaByte = (1073741824 + 1)
    const incorrectMimetype = 'fse/mpeg'

    const file = {
      mimetype: incorrectMimetype,
      size: greaterThan1GigaByte,
      destination: path.resolve(__dirname),
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4')
    }

    const sut = new FileValidator()
    const fileOrError = sut.verify(file)
    const err = new Error('No valid file information provided')
    err.name = 'mimetype,size'

    expect(fileOrError).toEqual(err)
    expect(fileOrError).toHaveProperty('name', err.name)
  })
})
