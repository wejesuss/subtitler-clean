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
})
