import path from 'path'
import { FileValidatorAdapter } from './file-validator-adapter'

describe('File Validator', () => {
  test('Should return false if an invalid file info is provided', () => {
    const greaterThan1GigaByte = (1073741824 + 1)
    const incorrectMimetype = 'fse/mpeg'
    const destinationFolder = path.resolve(__dirname, '..', 'public/files')

    const sut = new FileValidatorAdapter()

    const file = {
      mimetype: incorrectMimetype,
      size: greaterThan1GigaByte,
      destination: destinationFolder,
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4')
    }

    const isValid = sut.isValid(file)

    expect(isValid).toBe(false)
  })

  test('Should return true if nothing is wrong', () => {
    const sut = new FileValidatorAdapter()

    const file = {
      mimetype: 'audio/mpeg3',
      size: 1073741824,
      destination: path.resolve(__dirname),
      filename: 'input.mp3',
      path: path.resolve(__dirname, 'input.mp3'),
      buffer: Buffer.from([109, 112, 51])
    }

    const isValid = sut.isValid(file)

    expect(isValid).toBe(true)
  })

  test('Should have been called with correct file info', () => {
    const sut = new FileValidatorAdapter()
    const isValidSpy = jest.spyOn(sut, 'isValid')

    const file = {
      mimetype: 'audio/mpeg3',
      size: 1073741824,
      destination: path.resolve(__dirname),
      filename: 'input.mp3',
      path: path.resolve(__dirname, 'input.mp3'),
      buffer: Buffer.from([109, 112, 51])
    }

    sut.isValid(file)

    expect(isValidSpy).toHaveBeenCalledWith(file)
  })
})
