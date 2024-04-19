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

  describe('GET /api/students', () => {
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

  describe('GET /api/students/:id', () => {
    test('succeeds with a valid id', async () => {
      const studentsAtStart = await helper.stundetsInDb()

      const studentToView = studentsAtStart[0].dataValues

      const resultStudent = await api
        .get(`/api/students/${studentToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(JSON.stringify(resultStudent.body), JSON.stringify(studentToView))
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const nonExistingStudentId = await helper.nonExistingStudentId()

      await api
        .get(`/api/students/${nonExistingStudentId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/students/${invalidId}`)
        .expect(400)
    })
  })

  after(async () => {
    await Student.destroy({ where: {} })
    await sequelize.close()
  })
})
