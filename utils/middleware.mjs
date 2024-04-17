const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`)
  next()
}

const errorHandler = (err, req, res, next) => {
  console.error(`${err.name}: ${err.message}`)
}

export default {
  requestLogger,
  errorHandler
}
