const postRouter = require('express').Router();
const postController = require('./../controllers/postController');

postRouter.all('/',postController.index);
postRouter.all('/post',postController.singlePost);

module.exports = postRouter;