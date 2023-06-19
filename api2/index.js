const express=require("express")
const PORT = process.env.PORT || 3002
const cors =require("cors")
const app =express()
require('dotenv').config()
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//aa
const rolecontrol=require("./utils/verifyToken.js")
const postsRouter=require("./router/posts.router")
const authRouter=require("./router/auth.router")
const docktorRouter=require("./router/doctor.router")
const adminRouter=require("./router/admin.router")
const clientRouter=require("./router/client.router")
const hastaneRouter=require("./router/hastane.router")


app.use(cors())
app.use("/",postsRouter)
app.use("/auth",authRouter)
app.use("/docktor",docktorRouter)
app.use("/admin",adminRouter)
app.use("/patient",clientRouter)
app.use("/hastane",hastaneRouter)

app.use(cookieParser());
app.use(express.json())

app.use((err,res,)=>{

    const errorStatus = err.status ||500
    const errorMessage = err.message ||"Something went wrong"


    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    })
})

app.listen(PORT, () => {
    console.log("Backend Çalışıyor......")
})