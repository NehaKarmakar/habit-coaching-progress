import {Schema, model} from "mongoose"

const userSchema = new Schema( {
    name: String,
    email: String,
    password: String,
    loginCount: {
        type: Number,
        default: 0
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