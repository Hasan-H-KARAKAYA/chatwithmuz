const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React uygulamasının çalıştığı adres
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı');

  socket.on('sendMessage', (message) => {
    io.emit('message', message); // Tüm kullanıcılara mesajı yayınla
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});