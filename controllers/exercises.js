const exerciseRouter = require("express").Router()
const Exercise = require("../models/exercise")

// Create an exercise, if same name exists, update it instead
exerciseRouter.post("/api/exercises/", async (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: "content missing" })
  }

  // Checks if exercise exists, if it does, updates the existing exercise
  const alreadyExistingExercise = await Exercise.findOne({ name: body.name })
  if (alreadyExistingExercise) {
    Exercise.findByIdAndUpdate(
      alreadyExistingExercise.id,
      {
        $set: {
          muscleGroup: body.muscleGroup,
          typeOfReps: body.typeOfReps,
        },
      },
      { new: true }
    )
      .then((updatedExercise) => {
        response.json(updatedExercise)
      })
      .catch((error) => next(error))
  } else {
    const newExercise = new Exercise({
      name: body.name,
      muscleGroup: body.muscleGroup,
      typeOfReps: body.typeOfReps,
    })
    newExercise
      .save()
      .then((result) => response.json(result))
      .catch((error) => next(error))
  }
})

// Get all exercises
exerciseRouter.get("/api/exercises/", (request, response) => {
  Exercise.find({}).then((result) => {
    response.json(result)
  })
})

// Get exercise by id
exerciseRouter.get("/api/exercises/:id", (request, response) => {
  Exercise.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Update an exercise
exerciseRouter.put("/api/exercises/:id", (request, response, next) => {
  const body = request.body

  const exercise = {
    name: body.name,
    muscleGroup: body.muscleGroup,
    typeOfReps: body.typeOfReps,
  }

  Exercise.findByIdAndUpdate(request.params.id, exercise, { new: true })
    .then((updatedExercise) => {
      response.json(updatedExercise)
    })
    .catch((error) => next(error))
})

// Delete an exercise
exerciseRouter.delete("/api/exercises/:id", (request, response) => {
  Exercise.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = exerciseRouter

