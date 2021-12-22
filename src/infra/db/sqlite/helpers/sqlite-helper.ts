import { Database } from 'sqlite3'
import { promisify } from 'util'
import crypto from 'crypto'

type Collections = 'files'

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
      this.client = new Database(filename, function (err) {
        if (err) reject(err)
        resolve()
      })
    })
  },

  async prepareDb (): Promise<void> {
    const run = promisify(this.client.run.bind(this.client))
    await run('CREATE TABLE IF NOT EXISTS files (id TEXT, filename TEXT, path TEXT, size INTEGER)')
  },

  async deleteAll (collection: Collections) {
    const run = promisify(this.client.run.bind(this.client))
    await run(`DELETE FROM ${collection}`)
  },

  async insertOne (collection: Collections, data: any): Promise<any> {
    const id = crypto.randomBytes(12).toString('hex')
    const dataWithId = Object.assign({}, data, { id })

    const columns = Object.keys(dataWithId)
    const placeholders = columns.map(() => '?').join(',')
    const values = Object.values(dataWithId)

    const run = promisify(this.client.run.bind(this.client))
    await run(`INSERT INTO ${collection} (${columns.join(',')}) VALUES (${placeholders})`, values)

    return dataWithId
  }
}
