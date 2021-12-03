import { GetLanguages } from './getLanguages'

describe('GetLanguages', () => {
  test('Should get valid languages', () => {
    const jsonSample = '{"de": "Alemão", "ar": "Árabe"}'
    const languagesObjSample = JSON.parse(jsonSample)

    const sut = new GetLanguages()
    const languagesObj = sut.languages
    const languagesList = sut.toList()

    expect(languagesObj).toMatchObject(languagesObjSample)

    languagesList.forEach(language => {
      expect(language).toHaveProperty('id')
      expect(language).toHaveProperty('name')
    })
  })

  test('Should return error if no valid language is provided', () => {
    const language = 'dafe'

    const sut = new GetLanguages()
    const err = sut.verify(language)

    expect(err).toEqual(new Error('Provided language is not valid'))
  })

  test('Should return language name if a valid language is provided', () => {
    const language = 'en'
    const expected = 'Inglês'

    const sut = new GetLanguages()
    const name = sut.verify(language)

    expect(name).toBe(expected)
  })
})
