const port = process.env.PORT || 3000;
const express = require('express');
const connect = require('./config/db');
const cors = require('cors');
const upload = require('./helpers/filehelper');
const {login, register} = require('./controllers/user.controller');
const app = express();

app.use(cors());
app.use(express.json());
app.post('/login', login);
app.post('/register',   upload.single('file'), register);

app.listen(port, async()=>{
    try {
        await connect();
        console.log(`running on port ${port}...`)
    } catch (error) {
        console.log(error.message);
    }
})