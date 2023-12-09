const exerciseRouter = require("express").Router()
const Exercise = require("../models/exercise")
const User = require("../models/user")
const jwt = require("jsonwebtoken")



// Create an exercise, if same name exists, update it instead
exerciseRouter.post("/", async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // Checks if there is a token in the request
  if (!decodedToken){
    return response.status(401).json({error: 'Token missing. You must log in first in order to create an exercise'})
  }

  // Checks if there is a user that matches this token.
  const user = await User.findById(decodedToken.id)
  if (!user){
    return response.status(401).json({error: "Wrong token. Can't find user that matches this token "})
  }
  
  // Checks if the name of the exercise has been given
  if (body.name === undefined) {
    return response.status(400).json({ error: "Name of the exercise is missing" })
  }

  // Checks if exercise exists, if it does, updates the existing exercise
  const alreadyExistingExercise = await Exercise.findOne({ name: body.name })

  if (alreadyExistingExercise) {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      alreadyExistingExercise.id,
      {
        $set: {
          muscleGroup: body.muscleGroup,
          typeOfReps: body.typeOfReps,
        },
      },
      { new: true }
    )
    return response.json(updatedExercise)
  } else {
    const newExercise = new Exercise({
      name: body.name,
      muscleGroup: body.muscleGroup,
      typeOfReps: body.typeOfReps,
      user: user.id
    })
    const savedExercise = await newExercise.save()
    user.exercises = user.exercises.concat(savedExercise._id)
    await user.save()
    response.json(savedExercise)
  }
})

// Get all exercises
exerciseRouter.get("/", async (request, response) => {
  const exercises = await Exercise.find({})
  response.json(exercises)
})

// Get exercise by id
exerciseRouter.get("/:id", async (request, response) => {
  const foundExercise = await Exercise.findById(request.params.id)

  if (foundExercise) {
    response.json(foundExercise)
  } else {
    response.status(404).end()
  }
})

// Update an exercise
exerciseRouter.put("/:id", async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  const user = await User.findById(decodedToken.id)
  const exerciseFound = await Exercise.findById(request.params.id)
  
  if (!user){
    return response.status(404).json({error: "Wrong token. Can't find user that matches this token "})
  }
  if (!exerciseFound){
    return response.status(404).json({error: "Wrong id in the path. Can't find exercise that matches this token "})
  }
  if (exerciseFound.user.toString() !== user.id.toString()) {
     return response.status(401).json({error: "You're unauthorized to delete this user's exercise"})
  }

  const exercise = {
    name: body.name,
    muscleGroup: body.muscleGroup,
    typeOfReps: body.typeOfReps,
  }

  const updatedExercise = await Exercise.findByIdAndUpdate(
    request.params.id,
    exercise,
    { new: true }
  )
  response.json(updatedExercise)
})

// Delete an exercise
exerciseRouter.delete("/:id", async (request, response, next ) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(`name from the verified token: ${decodedToken.name}`)
  
  const user = await User.findById(decodedToken.id)
  const exercise = await Exercise.findById(request.params.id)
  
  if (!user){
    return response.status(404).json({error: "Wrong token. Can't find user that matches this token "})
  }
  if (!exercise){
    return response.status(404).json({error: "Wrong id in the path. Can't find exercise that matches this token "})
  }
  if (exercise.user.toString() !== user.id.toString()) {
     return response.status(401).json({error: "You're unauthorized to delete this user's exercise"})
  }

  const deletedExercise = await Exercise.findByIdAndDelete(request.params.id)
  console.log(`Exercise.findByIdAndDelete completed. deleted exercise is: ${deletedExercise}`)
  response.status(200).json(deletedExercise)
})

module.exports = exerciseRouter
