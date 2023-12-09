const logger = require("./logger")

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorizationToken = req.get("authorization")

  if (authorizationToken && authorizationToken.startsWith("Bearer ")) {
    req.token = authorizationToken.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JasonWebTokenError") {
    return response
      .status(401)
      .json({ error: "There was a problem with the token" })
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    })
  }
  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
}