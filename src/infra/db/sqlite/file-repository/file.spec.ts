import { SQLiteHelper } from '../helpers/sqlite-helper'
import { FileSQLiteRepository } from './file'

const makeSut = (): FileSQLiteRepository => {
  return new FileSQLiteRepository()
}

describe('File SQLite Repository', () => {
  beforeAll(async () => {
    await SQLiteHelper.connect()
  })

  afterAll(async () => {
    await SQLiteHelper.disconnect()
  })

  test('Should return a file on success', async () => {
    const sut = makeSut()
    const file = await sut.add({
      filename: 'any_filename',
      path: 'any_path',
      size: 1073741824
    })

    expect(file).toBeTruthy()
    expect(file.id).toBeTruthy()
    expect(file.filename).toBe('any_filename')
    expect(file.path).toBe('any_path')
    expect(file.size).toBe(1073741824)
  })
})

describe('SQLiteHelper', () => {
  test('Should throw error if createDb throws', async () => {
    const promise = SQLiteHelper.createDb(':invalid:')

    await expect(promise).rejects.toThrow()
  })
})
