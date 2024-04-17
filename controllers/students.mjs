import { Router } from 'express'
import { Student } from '../models/index.mjs'
import bcrypt from 'bcrypt'

const studentsRouter = Router()

studentsRouter.get('/', async (req, res, next) => {
  try {
    const students = await Student.findAll()
    res.status(200).json(students)
  } catch (err) {
    next(err)
  }
})

studentsRouter.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id)

    if (!student) return res.status(404).json({ error: 'Student not found' })

    res.status(200).json(student)
  } catch (err) {
    next(err)
  }
})

studentsRouter.post('/', async (req, res, next) => {
  const { firstName, lastName, institutionalEmail, password, dni } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  try {
    const student = await Student.create({
      firstName,
      lastName,
      institutionalEmail,
      password: passwordHash,
      dni
    })
    res.status(201).json(student)
  } catch (err) {
    next(err)
  }
})

studentsRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params
  const { firstName, lastName, institutionalEmail, password, dni } = req.body

  try {
    const student = await Student.findByPk(id)

    if (!student) return res.status(404).json({ error: 'Student not found' })

    await student.update({ firstName, lastName, institutionalEmail, password, dni })
    res.json(student)
  } catch (err) {
    next(err)
  }
})

studentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id)

    if (!student) return res.status(404).json({ error: 'Student not found' })

    await student.destroy()
    res.json({ message: 'Student deleted successfully' })
  } catch (err) {
    next(err)
  }
})

export default studentsRouter
