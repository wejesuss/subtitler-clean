import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { SQLiteHelper } from '../helpers/sqlite-helper'

export class LogSQLiteRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    await SQLiteHelper.insertOne('errors', {
      stack,
      date: new Date()
    })
  }
}
