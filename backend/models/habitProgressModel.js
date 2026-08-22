import {Schema, model} from "mongoose"

const habitProgressSchema = new Schema( {
    habit: {
        type: Schema.Types.ObjectId,
        ref: "Habit",
        required: true
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        required: true
    },
    completedDate: {
        type: Date
    }
}, {timestamps: true});

const HabitProgress = model("HabitProgress" , habitProgressSchema)

export default HabitProgress