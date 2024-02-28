import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/translate', async (req, res) => {
  try {
    const {text} = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('source_language', 'en');
    encodedParams.set('target_language', 'fr');
    encodedParams.set('text', text);

    const options = {
      method: 'POST',
      url: 'https://text-translator2.p.rapidapi.com/translate',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
      },
      data: encodedParams,
    };

    const response = await axios.request(options);
    const translation=response.data.data.translatedText;
    if (!translation) {
      return res.status(500).json({ error: 'Invalid response from translation service' });
    }
    return res.status(200).json({"translation":translation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error',errorDetails: error.message});
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});