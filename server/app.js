import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import {v2 as cloudinary} from 'cloudinary'
import errMiddelware from './middelware/errorMIddelware.js'

const app=express()

app.use
(cors({
    origin: "http://localhost:5173",
    methods:'GET,POST',
    credentials:true
})
)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))



cloudinary.config({
    cloud_name:"dbxat3xex",
    api_key:"655457382263967",
    api_secret:"_hAuR3sFk47oskthu27xoGuC7k0"

})

app.use(cookieParser());
app.use(morgan('dev'))

// app.use('/ping',(req,res)=>{
//     res.send('pong')
// })

// routes of 3 module
import  userRouter from './routes/user.routes.js'
import coursesRouter from './routes/course.router.js'
import paymentRouter from './routes/payment.routes.js'


app.use('/api/v1/user',userRouter);
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/payments',paymentRouter)

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errMiddelware)

export default app