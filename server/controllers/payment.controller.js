import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import ApiError from "../utils/ApiError.js";

export const getRazorPayKey=async(req,res,next)=>{
    try {
        res.status(200).json({
            success:true,
            message:'Razarpay API key',
            key:process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        return next(
            new ApiError(error.message,501)
        )
    }
}

export const buySubscription=async(req,res,next)=>{
    try {
        const {_id} = req.user;
        const user=await User.findById(_id)
    
        if(!user){
            return next(
                new ApiError('Unauthorized, please login')
            )
        }
    
        if(user.role==='ADMIN'){
            return next(
                new ApiError(
                    'Admin cannot  puchase a subscription',400
                )
            )
        }
    
        const subscription= await razorpay.subscription.create({
            plan_id:process.env.RAZORPAY_PLAN_ID,
            customer_notify:1
        });
    
        user.subscription.id=subscription.id;
        user.subscription.status=subscription.status;
    
        await user.save();
    
        res.status(200).json({
            success:true,
            message:'Subscribed successfully',
            subscription_id:subscription._id
        })
    
    } catch (error) {
        return next(
            new ApiError(error.message,501)
        )
    }
}
export const verifySubscription=async(req,res,next)=>{
     try {
        const {_id} = req.user;
        const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id }=req.body
   
        const user = await User.findById(_id)
   
        if(!user){
           return next(
               new ApiError('Unauthorized, please login')
           )
        }
   
        const subscriptionId=user.subscription._id;
   
        const generatedSignature= await crypto
        .createHmac('sha256',process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');
   
        if(generatedSignature !== razorpay_signature){
           return next(
               new ApiError('Payment not verified please try again', 500)
           )
        }
   
        await Payment.create({
           razorpay_payment_id,
           razorpay_signature,
           razorpay_subscription_id
       });
   
       user.subscription.status='active';
       await user.save();
   
       res.status(200).json({
           success:true,
           message:'Payment verified successfully!'
       })
     } catch (error) {
        return next(
            new ApiError(error.message,501)
        )
     }
}
export const cancelSubscription= async(req,res,next)=>{
    try {
        const {_id}=req.user;
    
        const user= await User.findById(_id)
    
        if(!user){
            return next(
                new ApiError('Unauthorized, please login')
            )
        }
    
        if(user.role==='ADMIN'){
            return next(
                new ApiError(
                    'Admin cannot  puchase a subscription',400
                )
            )
        }
    
        const subscriptionId=user.subscription._id;
        const subscription =await razorpay.subscriptions.cancel(
            subscriptionId
        )
    
        user.subscription.status=subscription.status
    
        await user.save();
    } catch (error) {
        return next(
            new ApiError(error.message,501)
        )
    }
}
export const allPayments=async(req,res,next)=>{
    try {
        const {count}=req.query;
    
        const payments= await razorpay.subscriptions.all({
            count: count ||10,
        });
    
        res.status(200).json({
            success:true,
            message:'All payments',
            payments
        })
    } catch (error) {
        return next(
            new ApiError(error.message,501)
        )
    }
}