import { useEffect } from "react";
import toast from "react-hot-toast";
import {BiRupee} from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import HomeLayout from "../../Layouts/HomeLayout";
import { getRazorpayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice";


function Checkout() {

    const dispatch=useDispatch()
    const navigate= useNavigate()
    const razorpaykey=useSelector((state)=> state.razorpaykey);
    const subscription_id=useSelector((state)=> state.razorpaykey.subscription_id);
    const isPaymentVerified=useSelector((state)=> state?.razorpay?.isPaymentVerified);
    const userData=useSelector((state)=> state?.auth?.data);
    const paymentDetails={
        razorpay_payment_id:"",
        razorpay_subscription_id:"",
        razorpay_signature:"",
        theme:{
            color:'#f37254'
        },
        prefill:{
            email:userData.email,
            name:userData.fullName
        }
    }
    async function handleSubscription(e){
        e.preventDefault();
        if(!razorpaykey || !subscription_id){
            toast.error("Something went Wrong")
        }
        const options ={
            key:razorpaykey,
            subscription_id: subscription_id,
            name:"Coursify pvt. Ltd.",
            description:"Subscription",
            handler: async function (response){
                paymentDetails.razorpay_payment_id=response.razorpay_payment_id;
                paymentDetails.razorpay_signature=response.razorpay_signature;
                paymentDetails.razorpay_subscription_id=response.razorpay_subscription_id;

                toast.success("payment successful")

               const res= await dispatch(verifyUserPayment(paymentDetails));

                res?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/fa")
            }

        }

        const paymentObject= new window.razorpay(options);
        paymentObject.open();
    }

    async function load(){
        await dispatch(getRazorpayId());
        await dispatch(purchaseCourseBundle());
    }
    useEffect(()=>{
        load()
    },)

  return (
    <HomeLayout>
        <form 
        onSubmit={handleSubscription}
        className="min-h[90vh] flex items-center justify-center text-white"
        >
            <div className="w-80 h-[26rem] flex flex-col justify-center
             shadow-[0_0_10px_black] rounded-lg">
                <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 
                text-2xl font-bold rounded-tlolg rounded-tr-lg"
                >Subscription Bundle</h1>
                <div className="px-4 space-y-5 text-center">
                    <p className="text-[17px]">
                        This Purchase Will Allow You to access all available course
                        of our platform for {" "}
                        <span className="text-yellow-500 font-bold">
                            <br />
                           1 Year duration
                        </span> {' '}
                        All the existing and new launched course will be also available
                    </p>
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                        <BiRupee/> <span>4999</span>
                    </p>
                    <div className="text-gray-200">
                       <p>100% refund on cancellation</p> 
                       <p>* Terms and Condition applied</p>
                    </div>
                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 transition-all 
                      easy-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg">
                        Buy
                    </button>
                </div>
            </div>
        </form>
    </HomeLayout>
  )
}

export default Checkout