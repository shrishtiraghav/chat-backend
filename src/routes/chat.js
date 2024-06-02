const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { BardAPI } = require('bard-api-node');
const Chat = require('../models/chat');
const dotenv = require('dotenv');
const fs = require('fs');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

dotenv.config();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const content = data.text;
    res.json({ text: content });
  } catch (error) {
    res.status(500).json({ message: 'Error generating response', error });
  }
});

router.post('/chat', async (req, res) => {
  try{
  const prompt = req.body.prompt;
  const bard = new BardAPI();
  await bard.initializeChat(process.env.API_KEY);
  const response = await bard.getBardResponse(prompt);
  res.json({response})
} catch (error) {
  res.status(500).json({ message: 'Error generating response', error });
}
    })

module.exports = router;
