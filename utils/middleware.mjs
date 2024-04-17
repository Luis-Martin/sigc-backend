const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`)
  next()
}

export default {
  requestLogger
}
