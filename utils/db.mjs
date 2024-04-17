import { Sequelize } from 'sequelize'
import config from './config.mjs'

const sequelize = new Sequelize(config.DATABASE_URL, { dialect: 'postgres' })

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to the database')
  } catch (err) {
    console.error('Failed to connect to the database')
    console.error(err.message)
  }
}

export { sequelize, connectToDatabase }
