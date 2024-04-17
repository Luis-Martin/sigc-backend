import logger from '../utils/looger.mjs'

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path} ${JSON.stringify(req.body)}`)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: err.message })
  } else if (err.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: err.message })
  }

  logger.error(`${err.name}: ${err.message}`)
  next()
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
