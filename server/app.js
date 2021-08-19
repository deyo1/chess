const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

let listOfGames = [];
let gameRooms = [];


io.on('connection', socket => {
    io.emit('listOfGames', listOfGames);
    socket.on('new game', game => {
        listOfGames.push(game);
        io.emit('listOfGames', listOfGames);
    });
    socket.on('disconnect', () => {
        listOfGames = listOfGames.filter(game => game.id !== socket.id);
        io.emit('listOfGames', listOfGames);
    });
    socket.on('play', game => {
        socket.to(game.id).emit('startGame', game);
        listOfGames = listOfGames.filter(element => (element.id !== socket.id
            && element.id !== game.id));
        io.emit('listOfGames', listOfGames);


    });
    socket.on('startOfGame', room => {
        socket.join(room);
        const time = Date.now();
        io.to(room).emit('startOfGame', time);
        if (gameRooms.every(element => element[0] !== room)) {
            gameRooms.push([room, [`_ _ ${time}`]]);
        }
    });
    socket.on('move', (room, newMove, time) => {
        socket.to(room).emit('move', newMove, time);
        gameRooms.find(element => element[0] === room)[1].push(`${newMove} ${time}`);
    });
    socket.on('gameEnd', room => {
        gameRooms = gameRooms.filter(element => element[0] !== room);
    });
});





server.listen(8000, () => console.log('server running on port 8000'));