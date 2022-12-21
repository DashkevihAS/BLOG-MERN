import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose
  .connect(
    'mongodb+srv://Anton:Password@cluster0.0patpvi.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('Mongo connect'))
  .catch((error) => console.log('Mongo error:', error));

const app = express();

const PORT = 4444;

app.use(express.json());

app.post('/auth/registration', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { email, password, fullName, avatarUrl } = req.body;

    const salt = await bcrypt.genSalt(7);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email,
      passwordHash: hash,
      fullName,
      avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, 'secret123', {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось зарегестрироваться' });
    console.log(error);
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `Пользватель не найден` });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user._doc.passwordHash,
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: `Неверный логин или пароль` });
    }

    const token = jwt.sign({ _id: user._id }, 'secret123', {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось авторизоваться' });
    console.log(error);
  }
});

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Нет доступа' });
    console.log(error);
  }
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server run on PORT: ${PORT}`);
});
