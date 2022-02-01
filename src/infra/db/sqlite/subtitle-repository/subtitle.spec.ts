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

type FileId = Record<'file_id', string>
type PartialAddSubtitleModel = Pick<AddSubtitleModel & FileId, 'language' | 'file_id' |'external_id' | 'sent_to_creation'>

const makeFakeAddSubtitleModel = (): PartialAddSubtitleModel => ({
  language: 'any_language',
  file_id: 'any_id',
  external_id: 'any_external_id',
  sent_to_creation: true
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

  test('Should call SQLiteHelper.insertOne with correct values', async () => {
    const sut = makeSut()
    const SQLiteHelperSpy = jest.spyOn(SQLiteHelper, 'insertOne')
    const fileData = makeFakeFileData()

    await sut.add(fileData)

    expect(SQLiteHelperSpy).toHaveBeenCalledWith(collectionName, makeFakeAddSubtitleModel())
  })

  test('Should return created subtitle on success', async () => {
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
