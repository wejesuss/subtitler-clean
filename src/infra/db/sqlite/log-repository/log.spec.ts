import { SQLiteHelper } from '../helpers/sqlite-helper'
import { LogSQLiteRepository } from './log'

const makeSut = (): LogSQLiteRepository => {
  return new LogSQLiteRepository()
}

describe('Log SQLite Repository', () => {
  beforeAll(async () => {
    await SQLiteHelper.connect()
  })

  beforeEach(async () => {
    await SQLiteHelper.deleteAll('errors')
  })

  afterAll(async () => {
    await SQLiteHelper.disconnect()
  })

  test('Should save error on repository', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const errors = await SQLiteHelper.getCollection('errors')

    expect(errors).toHaveLength(1)
  })
})
