import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Backend URL'si

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Kullanıcı adı iste
    const name = prompt('Kullanıcı adınızı girin:');
    setUsername(name);

    // Mesajları dinle
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

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