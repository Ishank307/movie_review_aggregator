const express= require('express')

const app= express()

app.use(express.json())

const movieRoutes = require("./routes/movieRoutes");
// const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");



app.use("/api/movies",movieRoutes);
app.use("/api",reviewRoutes);
app.use("/api/auth",authRoutes);
app.use("/api", reviewRoutes);


// checking wheather api is running or not
app.get("/health",(req,res)=>{
    res.send("API is running");  
})

module.exports=app