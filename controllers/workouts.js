const workoutRouter = require('express').Router()
const Workout = require('../models/workout')

workoutRouter.post('/', async (req, res) => {
  const {name} = req.body
})



module.exports = workoutRouter

