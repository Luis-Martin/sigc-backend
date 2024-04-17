import 'dotenv/config'
import express from 'express'
import { connectToDatabase } from './utils/db.mjs'
import studentsRouter from './controllers/students.mjs'
import middleware from './utils/middleware.mjs'

const app = express()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/students', studentsRouter)

const PORT = 3000
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
