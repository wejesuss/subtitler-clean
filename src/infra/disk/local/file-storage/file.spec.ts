import { existsSync, stat } from 'fs'
import path from 'path'
import { CreateFileLocalStorage } from './file'

describe('Create File LocalStorage', () => {
  test('Should save file to disk on success', async () => {
    const createFileLocalStorage = new CreateFileLocalStorage()
    const buffer = Buffer.from('text to test')
    const file = {
      filename: 'test_file_creation.txt',
      path: path.resolve(__dirname, 'test_file_creation.txt'),
      size: buffer.byteLength,
      buffer
    }

    const created = await createFileLocalStorage.create(file)
    expect(created).toBe(true)
    expect(existsSync(file.path)).toBe(true)

    stat(file.path, (err, status) => {
      expect(err).toBeNull()

      const isFile = status.isFile()
      const size = status.size

      expect(isFile).toBe(true)
      expect(size).toBe(file.size)
    })
  })
})
