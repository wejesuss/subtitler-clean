import { Database } from 'sqlite3'
import { promisify } from 'util'

export const SQLiteHelper = {
  client: null as Database,

  async connect (filename: string = ':memory:'): Promise<void> {
    await this.createDb(filename)
    await this.prepareDb()
  },

  async disconnect (): Promise<void> {
    const close = promisify(this.client.close.bind(this.client))
    await close()
  },

  async createDb (filename: string): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      this.client = new Database(filename, function () {
        resolve()
      })
    })
  },

  async prepareDb (): Promise<void> {
    const run = promisify(this.client.run.bind(this.client))
    await run('CREATE TABLE IF NOT EXISTS files (id TEXT, filename TEXT, path TEXT, size INTEGER)')
  },

  async insertOne (collection: string, data: any): Promise<any> {
    const columns = Object.keys(data)
    const placeholders = columns.map(() => '?').join(',')
    const values = Object.values(data)

    const run = promisify(this.client.run.bind(this.client))
    await run(`INSERT INTO ${collection} (${columns.join(',')}) VALUES (${placeholders})`, values)

    return data
  }
}
