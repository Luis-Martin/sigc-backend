import { Student } from '../models/index.mjs'
import bcrypt from 'bcrypt'

const getHash = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

const initialStudents = [
  {
    firstName: 'Sofia Ramirez',
    lastName: 'Martinex Vera',
    institutionalEmail: '2020011988@unfv.edu.pe',
    password: await getHash('password123!$'),
    dni: '12345678'
  },
  {
    firstName: 'Alejandro Vega',
    lastName: 'Rodriguez Torres',
    institutionalEmail: '2020019547@unfv.edu.pe',
    password: await getHash('password1234!$'),
    dni: '22345678'
  },
  {
    firstName: 'Valentina Maria',
    lastName: 'García García',
    institutionalEmail: '2022014752@unfv.edu.pe',
    password: await getHash('password12345!$'),
    dni: '32345678'
  }
]

const nonExistingStudentId = async () => {
  const student = await Student.create({
    firstName: 'Carlos Miguel',
    lastName: 'Martinez Martinez',
    institutionalEmail: '2020010711@unfv.edu.pe',
    password: await getHash('calosmrtmart123'),
    dni: '42346578'
  })

  await student.destroy()

  return Student.id
}

const stundetsInDb = async () => {
  const students = await Student.findAll()
  return students
}

export default {
  initialStudents,
  getHash,
  nonExistingStudentId,
  stundetsInDb
}
