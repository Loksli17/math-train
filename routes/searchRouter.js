const searchRouter = require('express').Router();
const searchConroller = require('./../controllers/searchController');

searchRouter.post('/find',searchConroller.searchAction);
searchRouter.all('/',searchConroller.index);

module.exports  = searchRouter;