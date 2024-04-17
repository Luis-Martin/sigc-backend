import 'dotenv/config'
import express from 'express'
import { connectToDatabase } from './utils/db.mjs'
import studentsRouter from './controllers/students.mjs'
import middleware from './utils/middleware.mjs'
import logger from './utils/looger.mjs'

const app = express()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/students', studentsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3000
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()
