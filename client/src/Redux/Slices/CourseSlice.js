import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState={
    courseData:[]
}

export const  getAllCourses=createAsyncThunk('/courses/get', async()=>{
    try {
        const response = axiosInstance.get('/courses');
         toast.promise(response, {
            loading:'loading course data...',
            success:'courses loaded successfully',
            error:'failed to get the courses',
        })
        return (await response).data.courses
    } catch (error) {
       toast.error(error?.responce?.data?.message); 
    }
});
export const createNewCourse=createAsyncThunk('/course/create', async(data)=>{
    try {
        let formData = new FormData()
        formData.append('title', data?.title)
        formData.append('description', data?.description)
        formData.append('category', data?.category)
        formData.append('createBy', data?.createBy)
        formData.append('thumbnail', data?.thumbnail)

        const response = axiosInstance.post('/courses',formData)
        toast.promise(response, {
            loading:'Create new Courses',
            success:'Course Created Successfully',
            error:'Failed to Create Course'
        })

        return (await response).data
        
    } catch (error) {
        toast.error(error?.data?.message);
    }
});

export const  deleteCourse=createAsyncThunk('/courses/get', async(id)=>{
    try {
        const response = axiosInstance.delete(`/courses/${id}`);
         toast.promise(response, {
            loading:'deleting course...',
            success:'courses delete successfully',
            error:'failed to delete the courses',
        })
        return (await response).data.courses
    } catch (error) {
       toast.error(error?.responce?.data?.message); 
    }
});

const courseSlice=createSlice({
    name:'courses',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(getAllCourses.fulfilled,(state,action)=>{
            if(action.payload){
                console.log(action.payload)
                state.courseData=[...action.payload];
            }
        })
    }
})

export default courseSlice.reducer;