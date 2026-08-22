import {Schema, model} from "mongoose"

const groupSchema = new Schema( {
    groupName:{
        type: String,
        required: true
    },

    description: {
        type: String
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true});

const Group = model( "Group" , groupSchema)

export default Group
