const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const env = require('dotenv')
const db = require('./config/db.config')
const InsertData = require('./db_init')
const {Earthquake} = require('./models/earthquake.model')
const eartquake = require('./routes/earthquake');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())

app.use('/api/earthquake/',eartquake)   

Earthquake.findOne({}).then((res)=>{
    if(res == null){
        InsertData("./data/database.csv")
    }
})


app.listen(process.env.PORT,()=>{
    console.log(`App listening on port ${process.env.PORT}`);
})