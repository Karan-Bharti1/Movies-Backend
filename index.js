const {initializerDb}=require('./Database/db.connect')
initializerDb()
const Movie=require('./movie.models')
const express=require('express')
const app=express()
const PORT=3000
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json())
async function readMovieByTitle (movieTitle){
    try{
const movie=await Movie.findOne({title:movieTitle})
return movie
    }catch (error){
throw error
    }
}
app.get("/movies/:title",async(req,res)=>{
    try{
const movie=await readMovieByTitle(req.params.title)
if (movie){
    res.status(201).json(movie)
}else{
    res.status(404).json("Movie not found")  
}
    }catch(error){
        res.status(500).json({error:"Failed to fetch movie"})
    }
})
async function readAllMovies(){
    try{
const movies=await Movie.find()
return movies
    }
    catch(error){
throw error
    }
}
app.get("/movies",async(req,res)=>{
const movies=await readAllMovies()
try{
if(movies.length!=0){
    res.status(201).json(movies)
}else{
    res.status(404).json({error:"Movies Data not found"})
}
}catch(error){
 res.status(500).json({error:"Failed to fetch movies data"})
}
})
async function readMoviesByGenre(genreName) {
    try{
const movies=await Movie.find({genre:genreName})
return movies
    }catch(error){
        throw error
    }
}
app.get("/movies/genres/:genreName",async(req,res)=>{
    const movies= await readMoviesByGenre(req.params.genreName)
    if(movies.length!=0){
        res.json(movies)
    }else{
            res.status(404).json({error:"No movies Found"})
    }
})
async function createMovie(newMovie){
    try {
     const movie=new Movie(newMovie)
     const saveMovie=await movie.save()
 return saveMovie
    } catch (error) {
     throw error
    }
 }
 app.post("/movies",async(req,res)=>{
     try {
         const savedMovie=await createMovie(req.body)
         res.status(201).json({message:"Movie added successfully",savedMovie})
     } catch (error) {
         res.status(500).json({error:"Failed to add movie"})
     }
 })
 async function deleteMovie(movieId){
    try{
const deletedMovie=await Movie.findByIdAndDelete(movieId);
console.log(deletedMovie)
return deletedMovie
    }catch(error){
throw error
    }
}
app.delete("/movies/:movieId",async(req,res)=>{
    try {
        const deletedMovie=await deleteMovie(req.params.movieId) 
        if(deletedMovie)
      {
       res.status(200).json({message:"Movie Deleted successfully."})}else{
        res.status(404).json({error:"Data Not Found"})
       }
    } catch (error) {
      res.status(500).json({error:"Failed to delete movie"})  
    }
})
async function updateMovie(movieId,dataToBeUpdated){
    try {
       const updatedMovie=await Movie.findByIdAndUpdate(movieId,dataToBeUpdated,{new:true,}) 
     return updatedMovie  
    } catch (error) {
       throw error 
    }
}
app.post("/movies/:movieId",async(req,res)=>{
    try {
       const updatedMovie=await updateMovie(req.params.movieId,req.body) 
       if(updatedMovie){
        res.status(200).json({message:"Movie Updated Successfuly"})
       }else{
        res.status(404).json({error:"Movie Not Found"})
       }
    } catch (error) {
        res.status(500).json({error:"Failed to update movie"})
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on PORT",PORT)
})