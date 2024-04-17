import 'dotenv/config'
import { connectToDatabase } from './utils/db.mjs'
import logger from './utils/looger.mjs'
import app from './app.mjs'

const PORT = 3000
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()
