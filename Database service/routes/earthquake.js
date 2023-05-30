const express = require('express');

const router = express.Router();

const{
    AddEarthquake,
    GetLatestEarthquakesOfMagnitudeGT,
    GetEarthquakesInArea,
    GetEarthquakesByDate,
    UpdateEarthquake,
    DeleteEarthquake
} =  require('../controllers/earthquake.controller');

router.post('/AddEarthquake/',AddEarthquake)
router.get('/GetLatestEarthquakesOfMagnitudeGT/:magnitude',GetLatestEarthquakesOfMagnitudeGT)
router.get('/GetEarthquakesInArea/:Latitude1/:Latitude2/:Longitude1/:Longitude2', GetEarthquakesInArea)
router.get('/GetEarthquakesByDate/:date', GetEarthquakesByDate)
router.put('/UpdateEarthquake/', UpdateEarthquake)
router.delete('/DeleteEarthquake/:_id',DeleteEarthquake)

module.exports = router
