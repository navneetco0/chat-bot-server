require('dotenv').config()
const express = require('express')
const connect = require('./config/db')
const path = require('path')
const port = process.env.PORT || 3000;
const cors = require('cors');
const upload = require('./helpers/filehelper')
const { io, server, app } = require('./server')
const { login, register } = require('./controllers/user.controller')
const routes = require('./controllers/routes')
const Bot = require('./models/bot.model');
const Chat = require('./models/userintraction');

app.use(cors());
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.post('/login', login)
app.post('/register', upload.single('file'), register)
app.use('/', routes)

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`)
  socket.on('welcome', (msg)=>{
     Chat.find({user_id:msg}).then(result=>{
      io.emit(msg, result[0]);
     })
  })
  socket.on('responce me', ({option, chatId, id}) => {  
      Bot.findById(chatId).then((result)=>{
        Chat.find({user_id:id}).then((res)=>{
          let chat = [...res[0].chats, option, result?result:'I am in learning phase, please go through option. please type menu for menu'];
          Chat.findByIdAndUpdate({_id:res[0]._id}, {chats:chat}, {new:true}).then(re=>socket.emit(chatId, re));
        })
      });
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
