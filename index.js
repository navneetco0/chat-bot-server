require('dotenv').config()
const express = require('express')
const connect = require('./config/db')
const path = require('path')
const port = process.env.PORT || 3001
const upload = require('./helpers/filehelper')
const { io, server, app } = require('./server')
const { login, register } = require('./controllers/user.controller')
const routes = require('./controllers/routes')
const Bot = require('./models/bot.model')

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.post('/login', login)
app.post('/register', upload.single('file'), register)
app.use('/', routes)

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`)
  Bot.findById('63318232de6272d98904af80').then((result) =>
    io.emit('welcome', result),
  )
  socket.on('responce me', (msg) => {
    Bot.findById(msg).then((result) => {
      if (result) io.emit(msg, result) 
      else
        io.emit( msg, "I am in learning phase, please go through option. please type menu for menu" )
    }) 
  })
})
  
server.listen(port, async () => {
  try {
    await connect()
    console.log(`running on port ${port}...`)
  } catch (error) {
    console.log(error.message)
  }
})
