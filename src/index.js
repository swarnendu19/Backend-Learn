// require('dotenv').config()

import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({path: './.env'})


connectDB()














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


