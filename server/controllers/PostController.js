import PostModel from '../models/Post.js';

export const getAllPosts = async (req, res) => {
  try {
    //.populate('user').exec() чтобы подхватить данные из user
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось создать статью' });
    console.log(error);
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      //1-й параметр что найти
      {
        _id: postId,
      },
      // 2-й параметр как изменить
      {
        $inc: { viewsCount: 1 },
      },
      // 3-й параметр - опция  - вернуть пользователю обновленный документ
      {
        returnDocument: 'after',
      },
      // 4-й параметр  - фцнкция  что делать дальше
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Не удалось вернуть статью' });
        }
        if (!doc) {
          return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.json(doc);
      },
    );
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить статью' });
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Не удалось удалить статью' });
        }
        if (!doc) {
          return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.json({ success: true });
      },
    );
  } catch (error) {
    res.status(500).json({ message: 'Не удалось удалить статью' });
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось создать статью' });
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось обновить статью' });
    console.log(error);
  }
};
