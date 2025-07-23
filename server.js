const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Send message to Ollama's API
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral', // changed from 'llama3' to 'mistral'
      prompt: message,
      stream: false
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 