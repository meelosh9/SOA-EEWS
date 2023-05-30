const fs = require("fs");
const { parse } = require("csv-parse");
const {Earthquake} = require("./models/earthquake.model");

const InsertData = (filename) => {
    records=[]
  fs.createReadStream(filename)
  .pipe(parse({ delimiter: ",", from_line: 1, columns: true }))
        .on('data', chunk => {
            records.push(chunk);
            // console.log(chunk);
            if(records.length > 50){
                Populate(records);
                records = [];
            }
        })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

}

const Populate = (data) =>{
   
    Earthquake.insertMany(data).then(() => {
        console.log('Insert many completed...');
    }).catch((err) => {
        console.log(err);
        console.log('Insert many caused an error...');
    });
}

module.exports = InsertData;