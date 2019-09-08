const mongoose  = require('./../lib/database/mongoose');
const News = require('./../models/mongoose/newsModel');

exports.index = async function (req,res) {
    let news = await News.find({});

    res.render('news/index',{
        news : news,
    })
};


exports.singleNew = async function (req,res) {
  let get = req.query;
  let id  = get.id;
  let oneNew = {};

  if (mongoose.Types.ObjectId.isValid(id)){
       oneNew = await News.findById(id);
  }else{
      res.status(404);
      res.render('server/404', {error: 'Новость не найдена'});
      return;
  }

  if(oneNew == null){
      res.status(404);
      res.render('server/404', {error: 'Новость не найдена'});
      return;
   }

  res.render("news/new",{
      oneNew : oneNew,
  })

};
