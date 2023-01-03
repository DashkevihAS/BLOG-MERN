import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import mongoose from 'mongoose';

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations.js';

import { getMe, login, register } from './controllers/UserController.js';
import {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
  getLastTags,
} from './controllers/PostController.js';

mongoose
  .connect(
    'mongodb+srv://Anton:Password@cluster0.0patpvi.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('Mongo connect'))
  .catch((error) => console.log('Mongo error:', error));

const app = express();

// создаем хранилище для multer
const storage = multer.diskStorage({
  //когда будет любой файл загружаться, выполнится функция
  // которая вернет путь к файлу
  destination: (_, __, cb) => {
    if (!fs.existsSync('./server/uploads')) {
      fs.mkdirSync('./server/uploads');
    }
    cb(null, './server/uploads');
  },
  // перед тем как этот файл сохранить,
  //функция обьяснит как назвать этот файл
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
// создаем функцию которая позволит использовать multer
const upload = multer({ storage });

app.use(express.json());
app.use(cors());

// чтобы при запросе /uploads/картинка.jpg находило файл в нужной папке
app.use('/uploads', express.static('./server/uploads'));

const PORT = 4444;

app.post(
  '/auth/registration',
  registerValidation,
  handleValidationErrors,
  register,
);
app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.get('/auth/me', checkAuth, getMe);

// если придет такой запрос, то мы сначала используем мидлвор из multer
// ожидаем файл под названием image (свойсво image с картинкой )
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', getAllPosts);
app.get('/posts/tags', getLastTags);
app.get('/posts/:id', getOnePost);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  createPost,
);
app.delete('/posts/:id', checkAuth, deletePost);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  updatePost,
);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server run on PORT: ${PORT}`);
});
