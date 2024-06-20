import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from './Slices/AuthSlice.js'
import CourseSliceReducer from './Slices/CourseSlice'
import LectureSliceReducer from "./Slices/LectureSlice.js";
import RazorpaySliceReducer from "./Slices/RazorpaySlice.js";
import statSliceReducer from "./Slices/StatSlice.js";



const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        course:CourseSliceReducer,
        razorpay:RazorpaySliceReducer,
        lecture:LectureSliceReducer,
        stat: statSliceReducer,
    },
    devTools:true
});

export default store;