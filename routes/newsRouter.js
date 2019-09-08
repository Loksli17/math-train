const newsController = require('./../controllers/newsController');
const newsRouter      = require('express').Router();

newsRouter.all('/',newsController.index);
newsRouter.all('/new',newsController.singleNew);


module.exports = newsRouter;