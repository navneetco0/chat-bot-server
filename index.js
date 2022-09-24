const port = process.env.PORT || 3000;
const express = require('express');
const connect = require('./config/db');
const cors = require('cors');
const path = require('path');
const upload = require('./helpers/filehelper');
const {login, register} = require('./controllers/user.controller');
const routes = require('./controllers/routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/login', login);
app.post('/register',   upload.single('file'), register);
app.use('/', routes);

app.listen(port, async()=>{
    try {
        await connect();
        console.log(`running on port ${port}...`)
    } catch (error) {
        console.log(error.message);
    }
})