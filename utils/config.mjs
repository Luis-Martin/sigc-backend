import 'dotenv/config'

const PORT = process.env.PORT || 3001

let DATABASE_URL

if (process.env.NODE_ENV !== 'production') DATABASE_URL = process.env.DATABASE_URL

export default {
  PORT,
  DATABASE_URL
}
