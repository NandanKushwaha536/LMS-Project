import { Router } from "express";
import upload from "../middelware/multer.js";

import {getAllCourses,getLectureByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById } 
from '../controllers/course.controller.js'
import  isLoggedIn, { authorizeSubscribers, authorizedRole }  from '../middelware/auth.middelware.js'



const router=Router();

router.route('/')
.get(getAllCourses)
.post(
    isLoggedIn,
    authorizedRole('ADMIN'),
    upload.single('thumbnall'),
    createCourse
)

router.route('/:id')
.get(
    isLoggedIn,
  authorizeSubscribers,
  getLectureByCourseId
)
.put(
    isLoggedIn,
    authorizedRole('ADMIN'),
    updateCourse
)
.delete(
    isLoggedIn,
    authorizedRole('ADMIN'),
    removeCourse
)
.post(
    isLoggedIn,
    authorizedRole('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById 
)

export default router