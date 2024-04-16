import 'dotenv/config'
import express from 'express'
import { connectToDatabase } from './utils/db.mjs'

const app = express()

const PORT = 3000
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
