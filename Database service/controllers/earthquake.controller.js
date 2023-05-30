const {Earthquake} = require("../models/earthquake.model")


const AddEarthquake = async (req, res)=>{    
    try{ 
        const earthquake = await Earthquake.create({            
            Date: req.body.date,
            Time: req.body.time,
            Latitude: req.body.latitude,
            Longitude: req.body.longitude,
            Type: req.body.type,
            Depth: req.body.depth,
            Magnitude: req.body.magnitude, 
            MagnitudeType: req.body.magnitudeType,
            ID: req.body.id
        })
        res.status(200).send(earthquake)           
    }catch(err){
        err => res.status(500).send(err.message)
    }
    
}

const GetLatestEarthquakesOfMagnitudeGT= async (req, res)=>{
    
    try{
        let magnitude = req.params.magnitude
        console.log(magnitude);
        await Earthquake.find({Magnitude:{$gt:magnitude}}).sort({"Date": -1}).limit(1).then(result =>{
            res.status(200).send(result)
        })
    }
    catch(err){
        res.status(500).send(err.message)
    }
}
const GetEarthquakesInArea = async (req, res)=>{    
    try{
        longitude1 = parseFloat(req.params.Longitude1)
        longitude2 = parseFloat(req.params.Longitude2)
        latitude1 = parseFloat(req.params.Latitude1)
        latitude2 = parseFloat(req.params.Latitude2)
        console.log(longitude1, longitude2, latitude1, latitude2)

        await Earthquake.find({$and:[
            {Latitude:{$gt : latitude1}},
            {Latitude:{$lt : latitude2}},
            {Longitude:{$gt : longitude1}},
            {Longitude:{$lt : longitude2}}
        ]}).limit(1).then(result =>{
            res.status(200).send(result)
        })
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const GetEarthquakesByDate = async (req, res)=>{
    try{        
        let dateStart = new Date(Date.parse(req.params.date))
        dateStart.setHours(0,0,0,0)
        await Earthquake.find({Date : new Date(dateStart)}).limit(1).then(result =>{
            res.status(200).send(result)
        })  
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const UpdateEarthquake = async (req,res) => { 
    try {
        let earthquake = await Earthquake.findOne({_id:req.body._id})
        if (earthquake) {         
            earthquake.Date = req.body.date,
            earthquake.Time = req.body.time,
            earthquake.Latitude = req.body.latitude,
            earthquake.Longitude = req.body.longitude,
            earthquake.Type = req.body.type,
            earthquake.Depth = req.body.depth,
            earthquake.Magnitude = req.body.magnitude, 
            earthquake.MagnitudeType = req.body.magnitudeType,
            earthquake.ID = req.body.id    
            await earthquake.save()
            res.status(200).send("Uspesno promenjeno")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const DeleteEarthquake = async (req, res)=>{
    try{
        await Earthquake.deleteOne({_id:req.params._id}).then(()=>{
            res.status(200).send('Uspesno izbrisano')
        }).catch((err)=>{
            res.status(404).send('Korisnik nije pronadjen')
        })
    }
    catch(err){
        res.status(500).send(err.message)
    }
}


module.exports = {
    AddEarthquake,
    GetLatestEarthquakesOfMagnitudeGT,
    GetEarthquakesInArea,
    GetEarthquakesByDate,
    UpdateEarthquake,
    DeleteEarthquake
}