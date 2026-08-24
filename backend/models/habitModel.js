import {Schema, model} from "mongoose"

const habitSchema = new Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    frequency: {
        type: String,
        enum: ["Daily" , "Weekly"],
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resourceName:String,
    resourceUrl: String
   
}, {timestamps: true});

const Habit = model( "Habit" , habitSchema)

export default Habit;