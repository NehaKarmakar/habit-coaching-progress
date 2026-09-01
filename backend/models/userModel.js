import {Schema, model} from "mongoose"

const userSchema = new Schema( {
    name:{
        type: String,
        required:true
    },
    email: String,
    password: String,
    loginCount: {
        type: Number,
        default: 0
    },
    phone:{
        type: String,
        required:true
    },
    role: {
        type: String,
        enum: ["coach","member"],
        default: "member"
    },
    resetToken: {
        type: String
    },

    resetTokenExpiry: {
        type: Date
    }
    
}, {timestamps:true});

const User= model("User" , userSchema)

export default User