import { Sequelize } from 'sequelize'
import config from './config.mjs'
import logger from '../utils/looger.mjs'

let sequelize

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(config.DATABASE_URL, { dialect: 'postgres', logging: false }
  )
} else {
  sequelize = new Sequelize(config.DATABASE_URL, { dialect: 'postgres' })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connected to the database')
  } catch (err) {
    logger.error('Failed to connect to the database')
    logger.error(err.message)
  }
}

export { sequelize, connectToDatabase }
