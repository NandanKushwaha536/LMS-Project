import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'

 
 const isLoggedIn= async(req, res, next)=>{
    const {token}=req.cookies;

    if(!token){
        // return next(
           throw new ApiError('Unauthenticated, please login again',400)
        // )
    }

    const userDetails= await jwt.verify(token, process.env.JWT_SECRET)

    req.user=userDetails;

    next()
 }

export const authorizedRole= (...roles) => async (req,res,next )=>{
      const currentUserRoles=req.user.role;

if(!roles.includes(currentUserRoles)){
    // return next(
      throw  new ApiError('you do not have perssmission to access this route ' ,400)
    // )
}

  next()

 }

 export const authorizeSubscribers=async (req,res, next)=>{
     const subscription=req.user.subscription;

     const currentUserRole=req.user.role;
     
     if(currentUserRole !== 'ADMIN' && subscription.status !== 'active'){
        // return next(
          throw  new ApiError('please subscribce to access this route!',403)
        // )
     }

     next()
 }

 export default  isLoggedIn
 