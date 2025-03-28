const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Mesaj geçmişini saklamak için dizi
let messageHistory = [];

io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı');

  // Yeni bağlanan kullanıcıya mesaj geçmişini gönder
  socket.emit('messageHistory', messageHistory);

  socket.on('sendMessage', (message) => {
    // Mesajı geçmişe ekle
    messageHistory.push(message);
    
    // 100 mesaj sonrası eski mesajları temizle (isteğe bağlı)
    if (messageHistory.length > 100) {
      messageHistory = messageHistory.slice(-100);
    }
    
    // Tüm kullanıcılara yeni mesajı yayınla
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});