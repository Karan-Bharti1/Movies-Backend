const mongoose=require("mongoose")
require("dotenv").config()
const mongoUri=process.env.MONGODB
const initializerDb=async()=>{
    await mongoose.connect(mongoUri).then(()=>{
console.log("Connected to the Database")
    }).catch(error=>console.log("Error while connecting to the database ",error))
}
module.exports={initializerDb}