import express from 'express';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register } from './controllers/UserController.js';

mongoose
  .connect(
    'mongodb+srv://Anton:Password@cluster0.0patpvi.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('Mongo connect'))
  .catch((error) => console.log('Mongo error:', error));

const app = express();

const PORT = 4444;

app.use(express.json());

app.post('/auth/registration', registerValidation, register);

app.post('/auth/login', login);

app.get('/auth/me', checkAuth, getMe);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server run on PORT: ${PORT}`);
});
