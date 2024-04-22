import { Router } from 'express'
import { Student } from '../models/index.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
  const { institutionalEmail, password } = req.body

  const student = await Student.findOne({ where: { institutionalEmail } })
  const passwordCorrect = student === null
    ? false
    : await bcrypt.compare(password, student.password)

  if (!(student && passwordCorrect)) return res.status(401).json({ error: 'invalid username or password' })

  const studentForToken = {
    institutionalEmail: student.institutionalEmail,
    id: student.id
  }

  const token = jwt.sign(
    studentForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  res
    .status(200)
    .send({
      token,
      firstName: student.firstName,
      lastName: student.lastName,
      institutionalEmail: student.institutionalEmail
    })
})

export default loginRouter
