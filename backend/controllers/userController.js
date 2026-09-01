import User from "../models/userModel.js";
import sendEmail from "../utilis/sendEmail.js";
import {validationResult} from "express-validator"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
//import sendSMS from "../utilis/sendSMS.js";

dotenv.config()

const usersCltr= {}

usersCltr.register = async (req, res) => {
 const errors = validationResult(req)
 if(!errors.isEmpty()){
    return res.status(400).json( {errors: errors.array()})
 }

 const {name, email,phone, password} = req.body
 try{
    const user = new User( {name: name, email: email,phone:phone, password: password})
    const salt= await bcryptjs.genSalt()
    const hash= await bcryptjs.hash(password, salt)
    console.log(hash)
    user.password = hash
    const usersCount = await User.countDocuments()
    if(usersCount===0){
        user.role="coach"
    }
    else{
        user.role="member"
    }
    await user.save()
    await sendEmail( 
        user.email,
        "Welcome to Habit Coaching!",
        `Hi ${user.name},

         Welcome to Habit Coaching!

         Your account has been successfully created.
         You have been registered as a ${user.role}.

         We're happy to have you with us. You can now log in and start your habit coaching journey.

         Best regards,
         Habit Coaching Team`
    );
    console.log("email sent")
    /*await sendSMS(
        user.phone,
    `Hi ${user.name},

Welcome to Habit Coaching!

Your account has been successfully created.
You have been registered as a ${user.role}.

Best regards,
Habit Coaching Team`
    )*/
  
    return res.status(201).json( {message: "User successfully registered" , 
        data: {userId: user._id, name: name, email: email,phone:phone, role: user.role}})
    
 }
 catch(err){
    console.log(err.message)
    return res.status(500).json( {message: err.message})
 }
}


usersCltr.login = async (req, res) => {
    const errors= validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json( {errors: errors.array()})
    }
    const {email, password} = req.body
    try{
     const user= await User.findOne({email})
     if(!user) {
        return res.status(404).json( {message: "invalid email or password"})
     }
     const isVerified = await bcryptjs.compare(password,user.password)
     if(!isVerified) {
        return res.status(404).json( {message: "invalid email or password"})
     }

     const tokenData= {userId: user._id, role: user.role}
     const token= jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: "7d"})
     user.loginCount = user.loginCount+1
     await user.save()
     return res.status(200).json({token:token, user:user})
    }
    catch(err){
      console.log(err.message)
      return res.status(500).json( {message: "err.message"})
    }
}

usersCltr.profile= async (req, res) => {
    try{
    const user= await User.findById(req.userId)
    if(!user){
        return res.status(200).json({message: "Not found"})
    }
    return res.status(200).json(user)
    }
    catch(err){
     console.log(err.message)
     return res.status(500).json( {message: err.message})
    }
}

usersCltr.editProfile= async (req, res) => {
   
    const {name, email,phone} = req.body
    try{
        const updateFields = { name, email, phone };

       
        const user= await User.findOneAndUpdate( {_id: req.userId},updateFields,{returnDocument:"after", runValidators:true})
        if(!user){
            return res.status(404).json( {success: false, message: "User not found"})
        }
        return res.status(200).json( {success: true, message: "User data successfully got updated", data:user})


    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success:false, message: err.message})
    }
}

usersCltr.listOfUsers = async (req, res) => {
    try{
    const user= await User.find()
    if(!user) {
        return res.status(404).json( {message: "Users not found"})
    }
    return res.status(200).json( {message: "Users successfully found" , data: user})
    }
    catch(err){
      console.log(err.message)
      return res.status(500).json({message: err.message})
    }
}

usersCltr.checkField = async (req, res) => {
    const {field, value} = req.query
    if(!field || !value) {
        return res.status(400).json({message: "field and value are required"})
    }
    let user;
    if(field==="name"){
         user= await User.findOne({name: value})
    }
    else if(field==="email"){
         user= await User.findOne( {email: value})
    }
    else{
        return res.status(400).json( {message: "Bad Request"})
    }
    if(user) {
        return res.status(400).json( {field:field, success: false})
    }
    return res.json({field: field, success:true})

}

usersCltr.forgetPassword =  async (req, res) => {
    const {email} = req.body
    try{
        const user = await User.findOne( {email})
        if(!user){
            return res.status(404).json( {success: false, message: "User not found"})
        }

        const tokenData= {userId: user.id, role: user.role}
        const token= jwt.sign( tokenData, process.env.JWT_SECRET, {expiresIn: "10m"})
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
   
        await user.save()
        console.log("SAVED TOKEN:", user.resetToken);
console.log("SAVED EXPIRY:", user.resetTokenExpiry);

        await sendEmail( 
            user.email,
             "Reset Your Password",
            `Hi ${user.name},

Click the link below to reset your password:

http://localhost:5173/resetPassword/${token}

This link will expire in 10 minutes.

Best regards,
Habit Coaching Team`
        )

        return res.status(200).json( {success: true , message: "Password reset link sent to your email", data:user})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({success: false, message: err.message})
    }
}

usersCltr.resetPassword = async (req, res) => {
    const {token} = req.params
    const {password}= req.body
    try{
        const user = await User.findOne( {
            resetToken: token
        })
       
        if(!user){
            return res.status(400).json( {success: false, message: "Invalid token"})
        }
         console.log("name", user.name)
        if(user.resetTokenExpiry< Date.now()){
            return res.status(400).json( {success: false, message: "Reset token has expired"})
        }
        const salt= await bcryptjs.genSalt()
        const hash= await bcryptjs.hash(password,salt)
        console.log("reset hashe" , hash)
        user.password= hash
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save()
        await sendEmail(
    user.email,
    "Password Reset Successful",
    `Hi ${user.name},

Your password has been successfully reset.

If you made this change, you don't need to do anything else.

If you did not reset your password, please contact the Habit Coaching Team immediately.

Best regards,
Habit Coaching Team`
);
        return res.status(200).json({success: true, message: "Password reset successfully", data:user})


    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export default usersCltr