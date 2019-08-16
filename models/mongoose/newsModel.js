const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
   title:{
       type : String,
       required : true
   },

   image:{
       type: String,
       required : true,
   },

   text:{
       type: String,
       required: true,

   },
   description:{
       type: String,
       required: true,
   },
   date:{
       type: String,
       required: true,

   },
   view:{
       type: Number,
       required: true,
   }
});

let news = mongoose.model('news',newsSchema);
module.exports = news;