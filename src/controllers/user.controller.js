import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError}  from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateAccessAndRefreshTokens = async(userId)=> {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    
    return {refreshToken, accessToken}
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens")
  }
}

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
     
      const {fullname,email,username, password} = req.body
      console.log("email:",email);
      if(
        [fullname,email,username,password].some((field)=> field.trim() === "")
        ){
        throw new ApiError(400,"All Fields are required")
      }
      
      const existedUser = await User.findOne({
        $or:[{username}, {email}]
      })
      if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path ;
      
      let coverImageLocalPath;
      if (req.files && Array.isArray(req.files.coverImage) && 
      req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path ;
      }
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

const loginUser = asyncHandler(async(req,res)=>{
   //req body -> data
   //username or email
   //find the user
   // password check 
   //access and refresh token
   //send cookie 


   const {email, username,password} = req.body
   if(!(username || !email)){
    throw new ApiError(400,"username or email is required")
   }

   const user= await User.findOne( {
    $or:[{username} , {email}]
   })

   if(!user){
    throw new ApiError(404, "User doesnot exists")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(isPasswordValid){
    throw new  (401, "Password incorrect ")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const option = {
    httpOnly : true,
    secure: true
   }

   return res.status(200)
   .cookie("accessToken", accessToken,option)
   .cookie("refreshToken", refreshToken, option)
   .json(
    new ApiResponse(200, {
      user: loggedInUser, accessToken,
      refreshToken
    },
    "User Logged in Successfully"
    )
   )

})

const logoutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
       req.user._id,
      {
       $set: {
        refreshToken: undefined
       }
      },
      {
        new: true
      }
     )
    const option = {
    httpOnly : true,
    secure: true
   }
   
   return res
   .status(200)
   .clearCookie("accessToken", option)
   .clearCookie("refreshToken", option)
   .json(new ApiResponse(200, {} , "User logged out"))
})

export {registerUser, 
        loginUser,
        logoutUser
      }


// What I was thinking for register

//Encrypt password and take the email and name of user
//send the json data as string to the database 
       

//Login

//get the password and username
//check the user exists in database or not
//if user exists then give the acess token