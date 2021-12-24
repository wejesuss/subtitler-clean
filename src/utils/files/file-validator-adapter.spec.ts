import path from 'path'
import { FileValidatorAdapter } from './file-validator-adapter'

interface SutTypes {
  sut: FileValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new FileValidatorAdapter()

  return {
    sut
  }
}

describe('File Validator', () => {
  test('Should return false if an invalid file info is provided', () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)

    const file = {
      mimetype: 'invalid_mimetype',
      size: (1073741824 + 1),
      destination: 'invalid_destination',
      filename: 'invalid_filename',
      path: 'invalid_path'
    }

    const isValid = sut.isValid(file)

    expect(isValid).toBe(false)
  })

  test('Should return true if nothing is wrong', () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(true)

    const file = {
      mimetype: 'valid_mimetype',
      size: 1073741824,
      destination: 'valid_destination',
      filename: 'valid_filename',
      path: 'valid_path',
      buffer: Buffer.from('valid')
    }

    const isValid = sut.isValid(file)

    expect(isValid).toBe(true)
  })

  test('Should have been called with correct file info', () => {
    const { sut } = makeSut()
    const isValidSpy = jest.spyOn(sut, 'isValid')

    const file = {
      mimetype: 'any_mimetype',
      size: 1073741824,
      destination: path.resolve(__dirname, 'any_destination'),
      filename: 'any_filename',
      path: path.resolve(__dirname, 'any_path')
    }

    sut.isValid(file)

    expect(isValidSpy).toHaveBeenCalledWith(file)
  })
})
