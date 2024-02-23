import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError}  from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req,res)=>{
      //get user details from frontend
      //validation- not empty
      //check if user is already exists: username, email
      //check for images , check for avatar
      // upload them to clodinary, avatar
      //crate user object - create entry in db
      //remove password and reefresh token fill from response
      //check for user creation
      //return response
     
      const {fullName,email,username, password} = req.body
      console.log("email:",email);
      if(
        [fullName,email,username,password].some((field)=> field.trim() === "")
        ){
        throw new ApiError(400,"All Fields are required")
      }
      
      const existedUser = User.findOne({
        $or:[{username}, {email}]
      })
      if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path ;
      const coverImageLocalPath = req.files?.coverImage[0]?.path;
      if(!avatarLocalPath){
           throw new ApiError(400, "Avatar file is required");
      }
      
      const avatar= await uploadOnCloudinary(avatarLocalPath)
      const coverImage= await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar){
        throw new ApiError(409,"User with email or username already exists")
      }

      const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
      })

      const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
      )

      if(!createdUser){
        throw new ApiError(500, "Somthing went wrong");
      }

      return res.status(201).json(
        new ApiResponse(200, createdUser,'User Registered Successfully')
      ) 
})

export {registerUser}


// What I was thinking 

//Encrypt password and take the email and name of user
//send the json data as string to the database 
       