const mongoose  = require('./../lib/database/mongoose');
const News = require('./../models/mongoose/newsModel');
const Pagination = require('./../lib/pagination');

exports.index = async function (req,res) {
    let news = await News.find({});

    let page = 1,
        url  = req.originalUrl,
        count= 0;

    if(req.query.page != undefined){
            page = req.query.page;
            url = req.originalUrl.substring(0, req.originalUrl.length - 7);
        }
    count = await News.countDocuments();

    let pagination = new Pagination({
            pageSize  : 4,
            limit     : 1,
            page      : page,
            url       : url,
            count     : count,
        });

    news =  await News.find({}, null,{skip : pagination.skip, limit : pagination.limit});

    res.render('news/index',{
        news : news,
        pages: pagination.getPages(),
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
