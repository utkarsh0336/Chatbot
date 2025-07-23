import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, IconButton, List, ListItem, CircularProgress, Avatar, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/chat', { message: input });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response, timestamp: new Date() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 3, borderRadius: 4, minHeight: 500, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary">
            Chatbot
          </Typography>
          <List sx={{ flex: 1, overflowY: 'auto', mb: 2, maxHeight: 350 }}>
            {messages.map((msg, idx) => (
              <ListItem key={idx} disableGutters sx={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Avatar sx={{ bgcolor: msg.sender === 'user' ? 'grey.500' : 'primary.main', mx: 1, width: 32, height: 32 }}>
                  {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Box sx={{
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  px: 2, py: 1, borderRadius: 2, maxWidth: '75%',
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  wordBreak: 'break-word',
                }}>
                  {msg.text}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: msg.sender === 'user' ? 'grey.200' : 'grey.600',
                      mt: 0.5,
                      textAlign: msg.sender === 'user' ? 'right' : 'left'
                    }}
                  >
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
