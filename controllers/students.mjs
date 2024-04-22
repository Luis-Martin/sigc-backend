import { Router } from 'express'
import { Student } from '../models/index.mjs'
import bcrypt from 'bcrypt'

const studentsRouter = Router()

studentsRouter.get('/', async (req, res) => {
  const students = await Student.findAll()
  res.status(200).json(students)
})

studentsRouter.get('/:id', async (req, res) => {
  const student = await Student.findByPk(req.params.id)

  if (!student) return res.status(404).json({ error: 'Student not found' })
  res.status(200).json(student)
})

studentsRouter.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    institutionalEmail,
    password,
    dni,
    dateOfAdmission
  } = req.body

  if (password.length < 12) return res.status(400).json({ error: 'Minimum required length of 12 characters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const student = await Student.create({
    firstName,
    lastName,
    institutionalEmail,
    password: passwordHash,
    dni,
    dateOfAdmission
  })

  res.status(201).json(student)
})

studentsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const {
    password,
    personalEmail,
    cellphone,
    dateOfBirth,
    placeOfBirth,
    address
  } = req.body

  const student = await Student.findByPk(id)

  if (!student) return res.status(404).json({ error: 'Student not found' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  await student.update({
    password: passwordHash || student.password,
    personalEmail: personalEmail || student.personalEmail,
    cellphone: cellphone || student.cellphone,
    dateOfBirth: dateOfBirth || student.dateOfBirth,
    placeOfBirth: placeOfBirth || student.placeOfBirth,
    address: address || student.address
  })

  res.json(student)
})

studentsRouter.delete('/:id', async (req, res) => {
  const student = await Student.findByPk(req.params.id)

  if (!student) return res.status(404).json({ error: 'Student not found' })

  await student.destroy()
  res.json({ message: 'Student deleted successfully' })
})

export default studentsRouter
