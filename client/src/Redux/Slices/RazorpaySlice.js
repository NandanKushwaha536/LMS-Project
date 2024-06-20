import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosInstance"

const initialState={
    key:"",
    subscription_id:"",
    isPaymentVerified:false,
    allpayments:{},
    finalMonth:{},
    monthlySalesRecord:[]

}

export const getRazorpayId=createAsyncThunk("/razorpay/getId",async()=>{
    try {
        const response= await axiosInstance.gat('/payments/razorpay-key')
        return response.data;
    } catch (error) {
       toast.error('Faild to load data') 
    }
})
export const purchaseCourseBundle=createAsyncThunk("/purchaseCourse",async()=>{
    try {
        const response= await axiosInstance.post('/payments/subscribe')
        return response.data;
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})
export const verifyUserPayment=createAsyncThunk("/payments/verify",async(data)=>{
    try {
        const response= await axiosInstance.post('/payments/veryify',{
            razorpay_payment_id:data.razorpay_payment_id,
            razorpay_subscription_id:data.razorpay_subsciption_id,
            razorpay_signature:data.razorpay_signature
        })

        return response.data;
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})
export const getPaymentRecord=createAsyncThunk("/payments/",async()=>{
    try {
        const response= await axiosInstance.get('/payments?count=100')
        toast.promise(response, {
            loading:"Getting the payment record",
            success:(data)=>{
                return data?.data?.message
            },
            error:"Failed to get payment records"
        })
        return(await response).data;
    } catch (error) {
       toast.error("Operation failed") 
    }
})
export const cancelCourseBundle=createAsyncThunk("/payments/cancel",async()=>{
    try {
        const response= await axiosInstance.post('/payments?count=100')
        toast.promise(response, {
            loading:"unsubscribing the bundle",
            success:(data)=>{
                return data?.data?.message
            },
            error:"Failed to unsbubscrive"
        })
        return(await response).data;
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})

const razorpaySlice=createSlice({
    name:'razorpay',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getRazorpayId.fulfilled, (state, action) =>{
            state.key=action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled,(state, action)=>{
            state.subscription_id=action?.payload?.subscription_id;
        })
        .addCase(verifyUserPayment.fulfilled, (state, action)=>{
            toast.success(action?.payload?.message) 
            state.isPaymentVerified=action?.payload?.success;
        })

        .addCase(verifyUserPayment.rejected, (state, action)=>{
            toast.success(action?.payload?.message) 
            state.isPaymentVerified=action?.payload?.success;
        })

        .addCase(getPaymentRecord.fulfilled, (state, action)=>{
            state.allpayments=action?.payload?.allpayments;
            state.finalMonth=action?.payload?.finalMonth;
            state.monthlySalesRecord=action?.payload?.monthlySalesRecord
        })



    }
});

export default razorpaySlice.reducer;