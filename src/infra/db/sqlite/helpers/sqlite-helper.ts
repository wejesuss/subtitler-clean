import { Database } from 'sqlite3'

export const SQLiteHelper = {
  client: null as Database,

  async connect (filename: string = ':memory:'): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client = new Database(filename, (error) => {
        if (error) reject(error)
        resolve()
      })
    })
  },

  async disconnect (): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client.close((err) => {
        if (err) reject(err)

        resolve()
      })
    })
  }
}
