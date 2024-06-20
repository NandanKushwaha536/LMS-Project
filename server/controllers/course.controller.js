import Course from "../models/coursemodel.js"
import ApiError from "../utils/ApiError.js";
// import errMiddelware from "../middelware/errorMIddelware.js";
import cloudinary from 'cloudinary'
import fs from 'fs'

export const getAllCourses=async (req,res)=>{
    try {
        const courses= await Course.find({}).select('-lectures');
    
        res.status(200).json({
            success:true,
            message:"All Courses",
            courses
        });
    } catch (error) {
        return next (
            new ApiError(error.message, 500)
        )
    }
}


export const getLectureByCourseId= async function(req,res,next){
    try {
        const {_id}=req.params;
        const courses=await Course.findById(_id);

        if(!courses)
            return next (
                new ApiError(error.message, 500)
            )
        

        res.status(200).json({
            success:true,
            message:'Courses lectures fetched successfully',
            lectures:courses.lectures,
     })
    } catch (error) {
        return next (
            new ApiError(error.message, 500)
        )
    }
}

export const createCourse= async (req, res,next)=>{
    const {title,description,category,createdBy}=res.body;

    if(!title||!description||!category||!createdBy)

        return next(
            new ApiError('All fields are required',400)
        )

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id:'dummy',
                secure_url:'dummy'
            }
        })

        if(!course){
            return next(
                new ApiError('Course could not created please try again')
            )
        }

        if (req.file){
            try {
                const result= await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms'
                });
                if (result){
                    Course.thumbnail.public_id= result.public_id;
                    Course.thumbnail.secure_url= result.secure_url;
                }
    
                fs.rm(`uploads/${req.file.filename}`)
            } catch (error) {
                return next(
                    new ApiError(error.message,500)
                )
            }
        }

        await course.save();

        res.status(200).json({
            success:true,
            message:'Course created successfully',
            course,
        })
}

export const updateCourse= async(req,res, next)=>{
    try {

        const  {_id}=req.params;
        const course =await Course.findByIdAndUpdate(
            _id,
            {
                $set:req.body
            },
            {
                runValidators:true
            }
        );

        if(!course){
            return next(
                new ApiError("course with given id does not exist",500)
            )
        }

        res.status(200).json({
            success:true,
            message:'courese update successfully'
        })
        
    } catch (error) {
        return next(
            new ApiError(error.message,500)
        )
    }
}

export const removeCourse=async (req ,res, next)=>{

    try {
        
        const {_id} =req.params;

        const course= await Course.findById(_id);

        if (!course){
            return next(
                new ApiError('Course with given id does not exist',500)
            )
        }

        await Course.findByIdAndDelete(_id);

        res.status(201).json({
            success:true,
            message:'course deleted successfully'
        })
    } catch (error) {
        return next(
            new ApiError(error.message,500)
        )
    }
}

export const  addLectureToCourseById =async (req,res,next) =>{
    try {
        const {title, description}=req.body;
    
        const {_id}=req.params;
        
        if(!title||!description)
    
            return next(
                new ApiError('All fields are required',400)
            )
    
        const course = await Course.findById(_id);
        
        if (!course){
            return next(
                new ApiError('Course with given id does not exist',500)
            )
        }
    
        const lecutureData ={
            title,
            description,
            lecture:{}
        };
    
        if (req.file){
            try {
                 const result= await cloudinary.v2.uploader.upload(req.file.path,{
                        folder:'lms'
                    });
                    if (result){
                        lecutureData.lecture.public_id= result.public_id;
                        lecutureData.lecture.secure_url= result.secure_url;
                    }
        
                    fs.rm(`uploads/${req.file.filename}`)
                } catch (error) {
                    return next(
                        new ApiError(error.message,500)
                    )
                }
            }
    
            course.lectures.push(lecutureData)
    
            course.numbersOfLectures=course.lectures.length;
    
            await course.save();
    
            res.status(200).json({
                success:true,
                message:'Lecture sucessfully added to the course',
                course
                
        })
    } catch (error) {
        return next(
            new ApiError(error.message,500)
        )
    }
}
