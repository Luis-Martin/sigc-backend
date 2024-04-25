import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import { sequelize } from '../utils/db.mjs'
import supertest from 'supertest'
import app from '../app.mjs'

import { Student } from '../models/index.mjs'
import helper from './test_helper.mjs'

const api = supertest(app)

describe('Student controller', () => {
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

    test('fails with status code 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/students/${invalidId}`)
        .expect(400)
    })
  })

  describe('POST /api/students', () => {
    test('create a new student with the correct data', async () => {
      const newStudent = {
        firstName: 'John Simon',
        lastName: 'Doe Levy',
        institutionalEmail: '2022015123@unfv.edu.pe',
        password: 'password123456',
        dni: '12345679',
        dateOfAdmission: 2021
      }

      const response = await api
        .post('/api/students')
        .send(newStudent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.firstName, newStudent.firstName)
      assert.strictEqual(response.body.lastName, newStudent.lastName)
      assert.strictEqual(response.body.institutionalEmail, newStudent.institutionalEmail)
      assert.strictEqual(response.body.dni, newStudent.dni)
    })

    test('fails with status code 400, email is invalid', async () => {
      const newStudent = {
        firstName: 'Carlos',
        lastName: 'Levy Buendía',
        institutionalEmail: 'carlos@unfv.edu.pe',
        password: 'password12356',
        dni: '12345679',
        dateOfAdmission: 2021
      }

      const response = await api
        .post('/api/students')
        .send(newStudent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.match(response.body.error, /institutionalEmail failed/)
    })

    test('fails with status code 400, dni is invalid', async () => {
      const newStudent = {
        firstName: 'Carlos',
        lastName: 'Levy Buendía',
        institutionalEmail: '2022015123@unfv.edu.pe',
        password: 'password12356',
        dni: '123456789',
        dateOfAdmission: 2021
      }

      const response = await api
        .post('/api/students')
        .send(newStudent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.match(response.body.error, /dni failed/)
    })

    test('fails with status code 400, password is invalid', async () => {
      const newStudent = {
        firstName: 'Carlos',
        lastName: 'Levy Buendía',
        institutionalEmail: '2022015123@unfv.edu.pe',
        password: 'carloslevy',
        dni: '12345678',
        dateOfAdmission: 2021
      }

      const response = await api
        .post('/api/students')
        .send(newStudent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.match(response.body.error, /Minimum required length of 12 characters/)
    })
  })

  describe('PUT /api/students/:id', () => {
    test('update an existing student', async () => {
      const studentsAtStart = await helper.stundetsInDb()
      const studentToUpdate = studentsAtStart[0].dataValues

      const newpassword = 'sofiamvpasswordsafest'
      const updatedStudentData = {
        ...studentToUpdate,
        password: newpassword,
        personalEmail: 'sofia.mv@example.com'
      }

      await api
        .put(`/api/students/${studentToUpdate.id}`)
        .send(updatedStudentData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      let updatedStudent = await Student.findByPk(studentToUpdate.id)
      updatedStudent = updatedStudent.dataValues

      assert.strictEqual(updatedStudent.personalEmail, updatedStudentData.personalEmail)
      assert.notEqual(updatedStudent.password, studentToUpdate.password)
    })

    test('fails with status code 404, student does not exist', async () => {
      const id = await helper.nonExistingStudentId()

      await api
        .put(`/api/students/${id}`)
        .expect(404)
    })

    test('fails with status code 400, student id invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/students/${invalidId}`)
        .expect(400)
    })
  })

  describe('DELETE /api/students/:id', () => {
    test('delete an existing student', async () => {
      const studentsAtStart = await helper.stundetsInDb()
      const studentToDelete = studentsAtStart[0].dataValues

      await api
        .delete(`/api/students/${studentToDelete.id}`)
        .expect(200)

      const deletedStudent = await Student.findByPk(studentToDelete.id)
      assert.strictEqual(deletedStudent, null)
    })

    test('fails with status code 404, student does not exist', async () => {
      const id = await helper.nonExistingStudentId()

      await api
        .delete(`/api/students/${id}`)
        .expect(404)
    })

    test('fails with status code 40, student id invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/students/${invalidId}`)
        .expect(400)
    })
  })

  after(async () => {
    await Student.destroy({ where: {} })
    await sequelize.close()
  })
})
