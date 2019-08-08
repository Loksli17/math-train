const mongoose = require('mongoose');

const resultSchema  = new mongoose.Schema({
   answer:{
       type    : Array,
       required: true,
   },
   data : {
       type    : Array,
       required: true,
   },
   isRight:{
       type    : Number,
       required: true,
   },
   task_id:{
       type    : String,
       required: true,
   }
});

let result = mongoose.model('result', resultSchema);
module.exports = result
