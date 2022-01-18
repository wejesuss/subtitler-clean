import { SQLiteHelper } from '../helpers/sqlite-helper'
import { AddFileModel } from '../../../../domain/usecases/add-file'
import { FileSQLiteRepository } from './file'

const makeFakeFileData = (): AddFileModel => ({
  mimetype: 'any_mimetype',
  language: 'any_language',
  filename: 'any_filename',
  path: 'any_path',
  size: 1073741824
})

const makeSut = (): FileSQLiteRepository => {
  return new FileSQLiteRepository()
}

describe('File SQLite Repository', () => {
  const collectionName = 'files'

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

    expect(SQLiteHelperSpy).toHaveBeenCalledWith(collectionName, fileData)
  })

  test('Should return created file on success', async () => {
    const sut = makeSut()
    const file = await sut.add(makeFakeFileData())

    expect(file).toBeTruthy()
    expect(file.id).toBeTruthy()
    expect(file.filename).toBe('any_filename')
    expect(file.path).toBe('any_path')
    expect(file.size).toBe(1073741824)
  })

  test('Should call SQLiteHelper.getOne with correct values', async () => {
    const sut = makeSut()
    const SQLiteHelperSpy = jest.spyOn(SQLiteHelper, 'getOne')
    const fileData = makeFakeFileData()

    const file = await sut.add(fileData)
    await sut.get(file.id)

    expect(SQLiteHelperSpy).toHaveBeenCalledWith(collectionName, file.id)
  })

  test('Should get file on success', async () => {
    const sut = makeSut()
    let file = await sut.add(makeFakeFileData())

    file = await sut.get(file.id)

    expect(file).toBeTruthy()
    expect(file.id).toBeTruthy()
    expect(file.filename).toBe('any_filename')
    expect(file.path).toBe('any_path')
    expect(file.size).toBe(1073741824)
  })
})
