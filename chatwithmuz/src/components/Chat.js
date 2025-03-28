import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const usernameSet = useRef(false); // Kullanıcı adının ayarlanıp ayarlanmadığını takip etmek için

  useEffect(() => {
    // Kullanıcı adı daha önce ayarlanmadıysa prompt göster
    if (!usernameSet.current) {
      const name = prompt('Kullanıcı adınızı girin:') || 'Anonim';
      setUsername(name);
      usernameSet.current = true; // Kullanıcı adının ayarlandığını işaretle
    }

    // Mesaj geçmişini al
    socket.on('messageHistory', (history) => {
      setMessages(history);
    });

    // Yeni mesajları dinle
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('messageHistory');
      socket.off('message');
    };
  }, []); // Boş dependency array, sadece ilk render'da çalışır

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', {
        username,
        text: message,
        time: new Date().toLocaleTimeString(),
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}: </strong>
            {msg.text}
            <span className="time">{msg.time}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
}

export default Chat;