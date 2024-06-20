import app from './app.js';
import { config } from 'dotenv'
config();
import connectionDB from './config/dbConnection.js';

import Razorpay from 'razorpay'


const PORT=process.env.PORT||5000

export const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

app.listen(PORT, async () => {
    await connectionDB();
    console.log(`Server started on port http://localhost:${PORT}`);
});