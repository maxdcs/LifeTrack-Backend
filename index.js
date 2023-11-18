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
  Exercise.findById(request.params.id).then(result => {
    response.json(result)
  })
})

app.delete('/api/foods/:id', (request, response) => {
  const id = request.params.id
  foods = foods.filter(f => f.id != id)
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})