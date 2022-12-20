import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
  .connect(
    'mongodb+srv://Anton:Password@cluster0.0patpvi.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => console.log('Mongo connect'))
  .catch((error) => console.log('Mongo error:', error));

const app = express();

const PORT = 4444;

app.use(express.json());

app.post('/registrtion', (req, res) => {
  const { login, password } = req.body;

  const token = jwt.sign({ login, email: 'example@email.com' }, 'secret123');

  res.json({
    success: true,
    token,
  });
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server run on PORT: ${PORT}`);
});
