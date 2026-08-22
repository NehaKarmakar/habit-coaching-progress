import {Schema, model} from "mongoose"

const groupEnrollmentSchema = new Schema( {
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const GroupEnrollment = model("GroupEnrollment", groupEnrollmentSchema)
export default GroupEnrollment