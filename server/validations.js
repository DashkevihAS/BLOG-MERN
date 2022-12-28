import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Длина пароля мнимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('avatarURL', 'Неверная ссылка на аватар').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Длина пароля мнимум 5 символов').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title ', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
  body('imageURL', 'Неверная ссылка на изображение').optional().isString(),
];