import { Router } from "express";
// import { verify } from "jsonwebtoken";
import { allPayments, buySubscription, cancelSubscription, getRazorPayKey, verifySubscription }
 from "../controllers/payment.controller.js";
import isLoggedIn from "../middelware/auth.middelware.js";

const router=Router()

router
.route('/razorpay-key')
.get(
    isLoggedIn,
    getRazorPayKey
);

router
.route('/subscribe')
.post(
    isLoggedIn,
    buySubscription
);

router
.route('/veryfy')
.post(
    isLoggedIn,
    verifySubscription
);


router
.route('/unsubscribe')
.post(
    isLoggedIn,
    cancelSubscription
)

router
.route('/')
.get(
    isLoggedIn,
    allPayments
)

export default router;