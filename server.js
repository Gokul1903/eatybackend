require('dotenv').config();
const path = require("path");
const express=require('express')
const cors = require('cors')
const mongoos=require('mongoose')
const authRouter=require('./eatyrouts/authRout')
const cookieParser = require('cookie-parser')
const shoprout=require('./eatyrouts/shoprout')
const userrout=require('./eatyrouts/useroperation')

const app=express()
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
const allowedOrigins = [
    "http://localhost:5173",
    "https://eatyapp.netlify.app",
    "https://eatypartner.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(cookieParser());    

app.use('/auth',authRouter)
app.use('/owner',shoprout)
app.use('/user',userrout)

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

