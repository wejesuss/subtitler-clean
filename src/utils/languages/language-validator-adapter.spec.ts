import { LanguageValidator } from '../../presentation/protocols/language-validator'
import { LanguageValidatorAdapter } from './language-validator-adapter'

const makeFakeLanguage = (): string => {
  return 'any_language'
}

interface SutTypes {
  sut: LanguageValidator
}

const makeSut = (): SutTypes => {
  const sut = new LanguageValidatorAdapter()

  return {
    sut
  }
}

describe('Language Validator', () => {
  test('Should return false if an invalid language is provided', () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)

    const language = makeFakeLanguage()
    const isValid = sut.isValid(language)

    expect(isValid).toBe(false)
  })

  test('Should return true if a valid language is provided', () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValue(true)

    const language = makeFakeLanguage()
    const isValid = sut.isValid(language)

    expect(isValid).toBe(true)
  })

  test('Should have been called with correct language', () => {
    const { sut } = makeSut()
    const isValidSpy = jest.spyOn(sut, 'isValid')

    const language = makeFakeLanguage()
    sut.isValid(language)

    expect(isValidSpy).toHaveBeenCalledWith(language)
  })
})
