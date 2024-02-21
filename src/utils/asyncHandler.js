const asyncHandler=(requestHandler)=>{
   (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
   }
}

export {asyncHandler}

//higher-Order function try catch method

// const asyncHandler = (func)=> async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }