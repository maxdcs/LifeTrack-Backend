require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Exercise = require('./models/exercise')

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))
app.use(cors())

// Create an exercise
app.post('/api/exercises/', (request, response) => {
  
  const body = request.body

  if (body.name === undefined){
    response.json({error: 'You must include a name'})
  }

  const newExercise = new Exercise({
    name: body.name,
    muscleGroup: body.muscleGroup,
    typeOfReps: body.typeOfReps,
  })

  newExercise.save().then(result => response.json(result))

})

// Get all exercises
app.get('/api/exercises/', (request, response) => {
  Exercise.find({}).then(result => {
    response.json(result)
  })
})

// Get exercise by id
app.get('/api/exercises/:id', (request, response) => {

  Exercise.findById(request.params.id)
    .then(result => {
      if (result){
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/exercises/:id', (request, response, next) => {
  
  const body = request.body

  const exercise = {
    name: body.name,
    muscleGroup: body.muscleGroup,
    typeOfReps: body.typeOfReps
  }

  Exercise.findByIdAndUpdate(request.params.id, exercise, {new: true})
  .then(updatedExercise => {
    response.json(updatedExercise)
  })
  .catch(error => next(error))
})

app.delete('/api/exercises/:id', (request, response) => {
  Exercise.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  next(error)

}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 5174
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})