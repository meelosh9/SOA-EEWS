const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const earthquakesSchema = new Schema({
    Date: {
        type: Date,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    Latitude: {
        type: Number,
        required: true
    },
    Longitude: {
        type: Number,
        required: true
    },
    Type: {
        type: String,
    },
    Depth: {
        type: Number,
    },
    Magnitude: {
        type: Number,
        required: true
    },
    MagnitudeType: {
        type: String,
    },
    ID: {
        type: String,
        required: true
    },
    })


const Earthquake = mongoose.model('Earthquake', earthquakesSchema);
module.exports = {
    Earthquake
}
