import request from 'supertest'
import app from '../../config/app'
import { SQLiteHelper } from '../../../infra/db/sqlite/helpers/sqlite-helper'

async function addFile (): Promise<string> {
  const file = await SQLiteHelper.insertOne('files', {
    language: 'any_language',
    mimetype: 'any_mimetype',
    path: 'any_path',
    filename: 'any_filename',
    size: 123
  })

  const id = file.id

  await addSubtitle(id)

  return id
}

async function addSubtitle (fileId: string): Promise<void> {
  await SQLiteHelper.insertOne('subtitles', {
    language: 'any_language',
    file_id: fileId,
    external_id: 'any_external_id',
    sent_to_creation: true
  })
}

let fileId = ''
describe('Subtitle Route', () => {
  beforeAll(async () => {
    await SQLiteHelper.connect()
  })

  beforeEach(async () => {
    await SQLiteHelper.deleteAll('subtitles')
    fileId = await addFile()
  })

  afterAll(async () => {
    await SQLiteHelper.disconnect()
  })

  test('Should return a subtitle on success', async () => {
    await request(app).post('/api/create-subtitle').send({
      id: fileId
    }).expect((res) => {
      expect(res.statusCode).toBe(200)

      const subtitle = res.body
      expect(subtitle).toBeTruthy()
      expect(subtitle.id).toBeTruthy()
      expect(subtitle.language).toBe('any_language')
      expect(subtitle.external_id).toBe('any_external_id')
      expect(subtitle.file_id).toBe(fileId)
      expect(subtitle.sent_to_creation).toBe(true)
    })
  })
})
