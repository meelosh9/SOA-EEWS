const mongoose = require('mongoose')
const env = require('dotenv').config()

const uri ="mongodb://mongodb:27017/EEWS";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error',(err)=>{
  console.log(err);
})

db.once('open',()=>{
  console.log('Database conncection established');
})

module.exports = db



