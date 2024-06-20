import  Router from "express";
import isLoggedIn from "../middelware/auth.middelware.js";
import upload from '../middelware/multer.js'
import {register,login,logout,getProfile,forgotpassword,resetpassword,changepassword,updateUser}
 from '../controllers/user.controller.js'


const router= Router();


router.route('/register')
.post(upload.single("avatar"),
register
);
router.route('/login')
.post(login);
router.route('/logout')
.post(logout);
router.route('/me')
.get(isLoggedIn, getProfile);
router.route('/reset')
.post(forgotpassword);
router.route('/reset/:resetToken')
.post(resetpassword);
router.route('/change-password')
.post(isLoggedIn, changepassword)
router.route('/update')
.put(
    isLoggedIn,
    upload.single('avatar'),
     updateUser
    )

export default router;