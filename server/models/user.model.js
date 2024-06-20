import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema=new Schema({
    fullName:{
        type:String,
        required:[true, "Name is required"],
        minLength:[5, 'Name must be at least 5 Character'],
        maxLength:[50, 'Name  should be less than 50 character'],
        lowerCase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true, 'email is required'],
        lowerCase:true,
        unique:true,
        trim:true,
        // match:[
        //     // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     // 'please fill in a valid email address'
        //  ]
    },
    password:{
        type:String,
        required:[true, "password is required"],
        minLength:[6, "password must be at 8 charector"],
        select:false,
        trim:true
    },
    avatar:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String
        }
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    subscription:{
        _id:String,
        status:String
    }

},{
    timestamps:true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password, 10)
    
    next()
})

userSchema.methods={
    generateJWTToken: async function(){
        return await jwt.sign({
            _id:this._id,
            role:this.role,
            email:this.email,
            fullName:this.fullName,
            subscription:this.subscription
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
  },

  comparePassword: async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword, this.password)
  },

  generatePasswordResetToken: async function(){
    const resetToken= await crypto.rendomBytes(20).toString('hex');

    this.forgotPasswordToken= await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'),
    this.forgotPasswordExpiry=Date.mow() +15*60*100;

  }

 }
const User=model("User",userSchema);

export default User;