import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import { sequelize } from '../utils/db.mjs'
import supertest from 'supertest'
import app from '../app.mjs'

import { Student } from '../models/index.mjs'
import helper from './test_helper.mjs'

const api = supertest(app)

describe('when there is initially some students saved', () => {
  beforeEach(async () => {
    await Student.destroy({ where: {} })

    const createPromises = helper.initialStudents.map(async (student) => {
      await Student.create(student)
    })
    await Promise.all(createPromises)
  })

  test('students are returned as json', async () => {
    await api
      .get('/api/students')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all students are returned', async () => {
    const response = await api.get('/api/students')

    assert.strictEqual(response.body.length, helper.initialStudents.length)
  })

  test('a specific student is within the returned students', async () => {
    const response = await api.get('/api/students')

    const firstNames = response.body.map(s => s.firstName)
    assert(firstNames.includes('Alejandro Vega'))
  })
})

after(async () => {
  await Student.destroy({ where: {} })
  await sequelize.close()
})
