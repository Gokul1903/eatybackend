require('dotenv').config();
const path = require("path");
const express=require('express')
const cors = require('cors')
const mongoos=require('mongoose')
const authRouter=require('./eatyrouts/authRout')
const cookieParser = require('cookie-parser')
const shoprout=require('./eatyrouts/shoprout')
const userrout=require('./eatyrouts/useroperation')
const admin=require('./eatyrouts/adminrout')

const app=express()
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const allowedOrigins = [
//     "http://localhost:5173",
//     "https://eatyapp.netlify.app",
    
//     "https://eatypartner.netlify.app",
//     "https://eatyadmin.netlify.app",
// ];
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like from a mobile app)
//     if (!origin) {
//       return callback(null, true);
//     }

//     // Allow if origin is in allowedOrigins list
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     // Block other origins
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true, // if you're using cookies or sessions
// };
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost'], // Add both just in case
  credentials: true
}));
app.use(express.json())
// app.use(cors(corsOptions));


app.use(cookieParser());    

app.use('/auth',authRouter)
app.use('/owner',shoprout)
app.use('/user',userrout)
app.use('/admin',admin)


mongoos.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to database")
        app.listen(process.env.PORT || 5000,()=>{
            console.log(`Listing to ${process.env.PORT}` )
        })
    }
    )
    .catch((err)=>{
        console.log(err)
    })

