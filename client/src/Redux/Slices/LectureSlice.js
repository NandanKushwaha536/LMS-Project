import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosInstance"
const initialState={
    lectures:[]
}

export const  getCourseLecture=createAsyncThunk("/course/lecture/get",async (cid) =>{
    try {
        const response= axiosInstance.get(`/courses/${cid}`);
        toast.promise(response ,{
            loading:'Fetching course lectures',
            success:'lectures fetched success',
            error:'Failed to load the Lectures'
        })
        return (await response).data;
    } catch (error) {
       toast.error(error?.response?.data?.message); 
    }
})

export const  addCourseLecture=createAsyncThunk("/course/lecture/get",async (data) =>{
    try {
         const formData =new FormData();
         formData.append("lecture",data.lecture);
         formData.append("title",data.title);
         formData.append("description",data.description);

        const response= axiosInstance.post(`/courses/${data.id}`, formData);
        toast.promise(response ,{
            loading:'adding course lectures',
            success:'lectures added success',
            error:'Failed to add the Lectures'
        })
        return (await response).data;
    } catch (error) {
       toast.error(error?.response?.data?.message); 
    }
})
export const  deleteCourseLecture=createAsyncThunk("/course/lecture/delete",async (data) =>{
    try {
         
        const response= axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lecturId}`);
        toast.promise(response ,{
            loading:'deleting course lectures',
            success:'lectures deleted success',
            error:'Failed to delete the Lectures'
        })
        return (await response).data;
    } catch (error) {
       toast.error(error?.response?.data?.message); 
    }
})
const  lectureSlice=createSlice({
    name:"lectures",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder.addCase(getCourseLecture.fulfilled,(state, action)=>{
            console.log(action);
            state.lectures=action?.payload?.lectures
        })

        .addCase(addCourseLecture.fulfilled,(state, action)=>{
            console.log(action)
            state.lectures=action?.payload?.course?.lectures;
        })
    }
});

export default lectureSlice.reducer;

