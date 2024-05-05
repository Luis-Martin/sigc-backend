import { test, after, beforeEach, describe } from 'node:test'
import { sequelize } from '../utils/db.mjs'
import { Course } from '../models/index.mjs'
import assert from 'node:assert'
import helper from './testCourseHelper.mjs'
import supertest from 'supertest'
import app from '../app.mjs'

const api = supertest(app)

describe('Course controller', () => {
  beforeEach(async () => {
    await Course.destroy({ where: {} })

    const createPromises = helper.initialCourses.map(async (course) => {
      await Course.create(course)
    })
    await Promise.all(createPromises)
  })

  describe('GET /api/courses', () => {
    test('courses are returned as json', async () => {
      await api
        .get('/api/courses')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all courses are returned', async () => {
      const response = await api.get('/api/courses')

      assert.strictEqual(response.body.length, helper.initialCourses.length)
    })

    test('a specific course is within the returned courses', async () => {
      const response = await api.get('/api/courses')

      const subjects = response.body.map(c => c.subject)

      assert(subjects.includes('Bases de Datos'))
    })
  })

  describe('GET /api/courses/:id', () => {
    test('succeeds with a valid id', async () => {
      const coursesAtStart = await helper.coursesInDb()

      const courseToView = coursesAtStart[0].dataValues

      const resultCourse = await api
        .get(`/api/courses/${courseToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(JSON.stringify(resultCourse.body), JSON.stringify(courseToView))
    })

    test('fails with statuscode 404 if course does not exist', async () => {
      const nonExistingCourseId = await helper.nonExistingCourseId()

      await api
        .get(`/api/courses/${nonExistingCourseId}`)
        .expect(404)
    })
  })

  describe('POST /api/courses', () => {
    test('create a new course with the correct data', async () => {
      const newCourse = {
        code: 123456,
        studyCycle: 5,
        subject: 'Biology',
        typeOfCourse: 'obligatorio',
        typeOfStudy: 'general',
        weeksLong: 16,
        weeklyTheoreticalHours: 4,
        weeklyPracticalHours: 2,
        credits: 5,
        studyPlan: 2022
      }

      const response = await api
        .post('/api/courses')
        .send(newCourse)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.subject, newCourse.subject)
      assert.strictEqual(response.body.typeOfCourse, newCourse.typeOfCourse)
    })
  })

  describe('PUT /api/courses/:id', () => {
    test('update an existing course', async () => {
      const coursesAtStart = await helper.coursesInDb()
      const courseToUpdate = coursesAtStart[0].dataValues

      const updatedCourseData = {
        ...courseToUpdate,
        subject: 'Physics',
        typeOfStudy: 'especialidad'
      }

      await api
        .put(`/api/courses/${courseToUpdate.id}`)
        .send(updatedCourseData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      let updatedCourse = await Course.findByPk(courseToUpdate.id)
      updatedCourse = updatedCourse.dataValues

      assert.strictEqual(updatedCourse.subject, updatedCourseData.subject)
      assert.strictEqual(updatedCourse.typeOfStudy, updatedCourseData.typeOfStudy)
    })

    test('fails with status code 404, course does not exist', async () => {
      const id = await helper.nonExistingCourseId()

      await api
        .put(`/api/courses/${id}`)
        .expect(404)
    })
  })

  describe('DELETE /api/courses/:id', () => {
    test('delete an existing course', async () => {
      const coursesAtStart = await helper.coursesInDb()
      const courseToDelete = coursesAtStart[0].dataValues

      await api
        .delete(`/api/courses/${courseToDelete.id}`)
        .expect(200)

      const deletedCourse = await Course.findByPk(courseToDelete.id)
      assert.strictEqual(deletedCourse, null)
    })

    test('fails with status code 404, course does not exist', async () => {
      const id = await helper.nonExistingCourseId()

      await api
        .delete(`/api/courses/${id}`)
        .expect(404)
    })
  })

  after(async () => {
    await Course.destroy({ where: {} })
    await sequelize.close()
  })
})
