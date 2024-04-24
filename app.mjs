import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import studentsRouter from './controllers/students.mjs'
import coursesRouter from './controllers/courses.mjs'
import loginRouter from './controllers/login.mjs'
import middleware from './utils/middleware.mjs'

const app = express()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
