const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "POST"],
    }
})

module.exports = {io, server, app};