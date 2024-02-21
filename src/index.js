// require('dotenv').config()

import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({path: './.env'})


connectDB()
.then(()=>{
    app.on("error", (err)=>{
        console.log("Error: ",err);
        throw err
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is runnning on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB Connection failed !!",err);
})














// import { Mongoose } from "mongoose";
// import { DB_NAME } from "./constant";

// ;(async ()=>{
//     try {
//        await Mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.log("Error",error);
//         throw error
//     }
// })()


