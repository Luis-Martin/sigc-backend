import { Router } from 'express'
import { EnrolledCourse, Student, Course } from '../models/index.mjs'
import bcrypt from 'bcrypt'

const enrolledCoursesRouter = Router()

enrolledCoursesRouter.get('/', async (req, res) => {
  const enrolledCourses = await EnrolledCourse.findAll()
  res.status(200).json(enrolledCourses)
})

enrolledCoursesRouter.get('/:id', async (req, res) => {
  const enrolledCourse = await EnrolledCourse.findByPk(req.params.id)

  if (!enrolledCourse) return res.status(404).json({ error: 'Enrolled course not found' })
  res.status(200).json(enrolledCourse)
})

enrolledCoursesRouter.post('/', async (req, res) => {
  const { studentId, courseId } = req.body

  const student = await Student.findByPk(studentId)
  const course = await Course.findByPk(courseId)

  if (!student || !course) return res.status(404).json({ error: 'Student or course not found' })

  // academicSemester, startOfClasses, enOfClasses
  const enrolledCourse = await EnrolledCourse.create({
    ...req.body
  })

  res.status(201).json(enrolledCourse)
})

enrolledCoursesRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { studentId, courseId, password } = req.body

  const enrolledCourse = await EnrolledCourse.findByPk(id)

  if (!enrolledCourse) return res.status(404).json({ error: 'Enrolled course not found' })

  // Verificar si el estudiante y el curso existen
  const student = await Student.findByPk(studentId)
  const course = await Course.findByPk(courseId)

  if (!student || !course) return res.status(404).json({ error: 'Student or course not found' })

  // Hashear la contraseña si se proporcionó
  let passwordHash = null
  if (password) {
    if (password.length < 12) return res.status(400).json({ error: 'Minimum required length of 12 characters' })
    const saltRounds = 10
    passwordHash = await bcrypt.hash(password, saltRounds)
  }

  // Actualizar el curso matriculado
  await enrolledCourse.update({
    ...req.body,
    password: passwordHash || enrolledCourse.password
  })

  res.json(enrolledCourse)
})

enrolledCoursesRouter.delete('/:id', async (req, res) => {
  const enrolledCourse = await EnrolledCourse.findByPk(req.params.id)

  if (!enrolledCourse) return res.status(404).json({ error: 'Enrolled course not found' })

  await enrolledCourse.destroy()
  res.json({ message: 'Enrolled course deleted successfully' })
})

export default enrolledCoursesRouter
