import { SQLiteHelper } from '../helpers/sqlite-helper'
import { AddSubtitleModel } from '../../../../domain/usecases/add-subtitle'
import { SubtitleSQLiteRepository } from './subtitle'

const makeFakeFileData = (): AddSubtitleModel => ({
  id: 'any_id',
  mimetype: 'any_mimetype',
  language: 'any_language',
  filename: 'any_filename',
  path: 'any_path',
  sent_to_creation: true,
  external_id: 'any_external_id'
})

const makeSut = (): SubtitleSQLiteRepository => {
  return new SubtitleSQLiteRepository()
}

describe('Subtitle SQLite Repository', () => {
  const collectionName = 'subtitles'

  beforeAll(async () => {
    await SQLiteHelper.connect()
  })

  beforeEach(async () => {
    await SQLiteHelper.deleteAll(collectionName)
  })

  afterAll(async () => {
    await SQLiteHelper.disconnect()
  })

  test('Should return subtitle on success', async () => {
    const sut = makeSut()
    const subtitle = await sut.add(makeFakeFileData())

    expect(subtitle).toBeTruthy()
    expect(subtitle.id).toBeTruthy()
    expect(subtitle.language).toBe('any_language')
    expect(subtitle.file_id).toBe('any_id')
    expect(subtitle.sent_to_creation).toBe(true)
    expect(subtitle.external_id).toBe('any_external_id')
  })
})
