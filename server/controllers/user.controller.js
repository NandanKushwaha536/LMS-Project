import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import next from "../middelware/errorMIddelware.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'

const cookieOptions={
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}


 export const register =async (req,res,next)=>{
    const { fullName, email, password }=req.body;

    if(!fullName||!email||!password){
       return next (
        new ApiError(400,"All fields are required")
    )
    }

    const userExists = await User.findOne({email});
    if (userExists){
        return next (
            new ApiError(400,"Email already exists")
        );
    }
 
    const user= await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:"cloudinary://655457382263967:_hAuR3sFk47oskthu27xoGuC7k0@dbxat3xex",
        }
    })

    if(!user){
    return next (
        new ApiError("User registation faild, please try again",400)
    )
    }
    // File upload

    if(req.file){
        console.log(req.file)
        try {
            const result= await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;

                // remove file from server

                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next (
                new ApiError(error || 'file not uploaded, please try again',500)
            )
        }
    }

    await user.save();

    user.password=undefined;

    const token= await user.generateJWTToken();

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
        success:true,
        message:'User registered sussessfully',
        user,
    });

    
}

export const login =async (req,res,next) =>{
    try {
        const { email, password}=req.body;
    
        if(!email && !password){
            return next(
                new ApiError('All fields are required',400)
            );
        }
    
        const user=await User.findOne({email}

        ).select('+password');
    
        if(!(user  && user.comparePassword(password))){
            return next(
                new ApiError('User does not exist', 400)
            )
        }
        // const isPasswordValid = await user.comparePassword(password)
        // if(!isPasswordValid){
        //     return next(
        //         new ApiError('Invalid user credentials', 401)
        //     )
        // }
        const token = await user.generateJWTToken();
    
        user.password=undefined;
    
        res.cookie('token', token, cookieOptions)
    
        res.status(200).json({
            success:true,
            message:'User loggedin successfully',
            user
        })
        
    } catch (error) {
        return next(
            new ApiError(error.message, 500)
        )
    }
}

export const logout =(req,res)=>{
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })
}

export const getProfile= async (req, res) =>{
    try {
        const userId=req.user._id;
    
        const user=await User.findById(userId)
        res.status(200).json({
            success:true,
            message:'User details',
            user
        })
    } catch (error) {
        return next(
            new ApiError('failed to fetch profile')
        )
    }
}

export const forgotpassword= async (req, res, next) =>{
    const {email}=req.body;

    if(!email){
        return next (new ApiError('email is requird',400));
    }

    const user=await User.findOne({email});
    if(!user){
        return next (
            new ApiError('Email not register',400)
        )
    }

    const resetToken= await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordURL=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject='Reset password'
    const message=` You can reset your password by clicking <a href=${ resetPasswordURL} target`;

    try {
        await sendEmail(email, subject, message)

        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    } catch (error) {

        user.forgotPasswordExpiry=undefined;
        user.forgotPasswordToken=undefined

        await user.save();
        return next (
        new ApiError(error.message,500)
        )
    }
}

export const resetpassword=async (req,res)=>{
    const {resetToken}=req.params;
    const {password}=req.body;

    const forgotPasswordToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user= await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })

    if(!user){
        return next (
            new ApiError('Token is invalid or expired, please try again',400)
    )
    }

    user.password=password;
    user.forgotPasswordToken=undefined;
    user.forgotPasswordExpiry=undefined;

    user.save();

    res.status(200).json({
        success:true,
        message:'password changed successfully'
    })
}

export const changepassword= async (req,res)=>{
    const {oldPassword, newPassword} = req.body
    const { _id} = req.user;

    if(!oldPassword || !newPassword){
        return next(
            new ApiError('All fields are mandatory',400)
        )
    }

    const user= await User.findById(_id).select('password');
    if(!user){
        return next(
            new ApiError("User doesn not exist" ,400)
        )
    }

    const isPasswordValid= await user.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(
            new ApiError("Invalid old password" ,400)
        )
    }
        user.password=newPassword

        await user.save();

        user.password=undefined

        res.status(200).json({
            success:true,
            message:'password changed success'
            
        })
}

export const updateUser=async(req,res)=>{
    const {fullName} = req.body;
    const {_id}=req.user._id;
    const user=await User.findById(_id);

    if(!user){
        return next(
            new ApiError('User does not exist',400)
        )
    }

    if(req.fullName){
        user.fullName=fullName
    }

    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result= await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;

                // remove file from server

                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next (
                new ApiError(error || 'file not uploaded, please try again',500)
            )
        }
    }

    await user.save();

    res.status(200).json({
        success:true,
        message:'user details upload successfully!'
    })
}

// export default {
//     avatar,   
//     register,
//     login,
//    logout,
    
// }


