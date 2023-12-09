const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (req, res) => {
  const {username, name, password} = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)

})

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('exercises')
  res.json(users)
})

module.exports = userRouter