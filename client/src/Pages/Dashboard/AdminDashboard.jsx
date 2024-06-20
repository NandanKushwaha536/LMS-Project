import {ArcElement, BarElement,CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,Tooltip} from 'chart.js'
import { useEffect } from 'react'
import { Bar, Pie} from "react-chartjs-2"
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs'
import {FaUsers} from "react-icons/fa"
import {FcSalesPerformance} from 'react-icons/fc'
import {GiMoneyStack} from 'react-icons/gi'
import { useDispatch, userSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import HomeLayout from "../../Layouts/HomeLayout"
import { deleteCourse, getAllCourses } from '../../Redux/Slices/CourseSlice'
import { getPaymentRecord } from '../../Redux/Slices/RazorpaySlice'
import { getStatData } from '../../Redux/Slices/StatSlice'



ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    Title,
    Tooltip
)
function AdminDashboard() {

    const dispatch=useDispatch()
    const navigate=useNavigate();

    const {allUsersCount, subscribedCount}=userSelector((state)=>state.stat);
    const {allpayment, monthlySalesRecord }=userSelector((state)=> state.razorpay);

    const userData ={
        labels:["Registerd User", 'Enrolled User'],
        datasets: [
            {
                label: "User Details",
                data:[allUsersCount, subscribedCount],
                backgroundColor:["yellow", "green"],
                BorderWidth:1,
                borderColor:['yellow', 'green']
            },
            {
                label: "User Details",
                data:[10, 15],
                backgroundColor:["red", "blue"],
                BorderWidth:1,
                borderColor:['yellow', 'green']
            }
        ]
    }

    const salesData ={
        labels:["jan","feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        fontColor:"white",
        datasets:[
            {
                label:"Sales/ Month",
                data:monthlySalesRecord,
                backgroundColor:['rgb(255,99,132)'],
                borderColor:["white"],
                BorderWidth:2
            }
        ]
    }

    const myCourses=userSelector((state)=> state?.course?.courseData)

    async function onCourseDelete(id){
        if(window.confirm("Are you sure want to delete the course ? ")){
            const res = await dispatch(deleteCourse(id))
            if(res?.payload?.success){
                await dispatch(deleteCourse(id));
                if(res?.payload?.success){
                    await dispatch(getAllCourses)
                }
            }
        }
    }
    useEffect(()=>{
        (
            async () =>{
                await dispatch(getAllCourses());
                await dispatch(getStatData());
                await dispatch(getPaymentRecord())
            }
        )()
    },[])
  return (
   <HomeLayout>
    <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
        <h1 className='text-center text-5xl font-semibold text-yellow-500'>
            Admin Dashboard
        </h1>

        <div className='grid grid-cols-2 gap-5 m-auto mx-10'>
            <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                <div className="w-8 h-80">
                    <Pie/>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="flex items-center justify-betwwen p-5 gap-5 rounded-md shadow-lg">
                        <div className="flex flex-col items-center">
                            <p className='font-semibold'>Registered Users</p>
                            <h3 className='text-4xl font-bold'>{allUsersCount}</h3>
                        </div>
                        <FaUsers className="text-yellow-500 text-5xl"/>
                    </div>

                    <div className="flex items-center justify-betwwen p-5 gap-5 rounded-md shadow-lg">
                        <div className="flex flex-col items-center">
                            <p className='font-semibold'>Subscribed Users</p>
                            <h3 className='text-4xl font-bold'>{subscribedCount}</h3>
                        </div>
                        <FaUsers className="text-green-500 text-5xl"/>
                    </div>
                </div>
           
            <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                <div className="h-80 w-full relative">
                    <Bar className='absolute bottom-0 h-80 w-full' data={salesData}/>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div className="flex items-center justify-betwwen p-5 gap-5 rounded-md shadow-lg">
                        <div className="flex flex-col items-center">
                            <p className='font-semibold'>Subscription Count</p>
                            <h3 className='text-4xl font-bold'>{allpayment?.count}</h3>
                        </div>
                        <FcSalesPerformance className="text-yellow-500 text-5xl"/>
                    </div>

                   <div className="flex items-center justify-betwwen p-5 gap-5 rounded-md shadow-lg">
                        <div className="flex flex-col items-center">
                            <p className='font-semibold'>Total Revenue</p>
                            <h3 className='text-4xl font-bold'>{allpayment?.count * 499}</h3>
                        </div>
                        <GiMoneyStack className="text-yellow-500 text-5xl"/>
                    </div>
                </div>
            </div>
        </div>

        <div className="mx-[10%] w-[80%] self-center flex-col items-center justify-center gap-4">
            <div className="flex w-full items-center justify-between">
               <h1 className='text-center text-3xl font-semibold'> 
                 Courses Overview
               </h1>

               <button
                 onClick={()=>{
                    navigate('/courese/create')
                 }}

                 className='w-fit bg-yellow-500 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded py-3 px-4 font-semibold text-lg curser-pointer'
               >
                 Create new Courese
               </button>
            </div>

            <table className='table overflow-x-scroll'>
                <thead>
                    <tr>
                        <th>S No</th>
                        <th>Courese Title</th>
                        <th>Course Category</th>
                        <th>Instructor</th>
                        <th>Total Lectures</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {myCourses?.map((course, idx)=>{
                        return (
                            <tr key={course._id}>
                                <td>{idx+1}</td>
                                <td>
                                    <textarea readOnly value={course?.title} className='w-40 h-auto bg-transparent resize-none'></textarea>
                                </td>
                                <td>
                                    {course?.category}
                                </td>
                                <td>
                                    {course?.createdBy}
                                </td>
                                <td>
                                    {course?.numberOfLectures}
                                </td>
                                <td className='max-w-28 overflow-hidden text-ellipsis whitespace-nowrap'>
                                    <textarea 
                                     value={course?.description}
                                     readOnly
                                     className='w-80 h-auto bg-transparent resize-none'
                                    ></textarea>
                                </td>
                                <td className='flex items-center gap-4 '>
                                    <button
                                      className='bg-green-500 hover:bg-green-600 transition-all 
                                      ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold'
                                      onClick={()=> navigate('/coures/displaylectures',{state:{}})}
                                    >
                                        <BsCollectionPlayFill/>
                                    </button>
                                    <button
                                      className='bg-red-500 hover:bg-green-600 transition-all 
                                      ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold'
                                      onClick={()=> onCourseDelete(course?.id)}
                                    >
                                        <BsTrash/>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
     </div>
    </div>
   </HomeLayout>
  )
}

export default AdminDashboard