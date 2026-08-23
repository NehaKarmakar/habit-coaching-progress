import {Schema, model} from "mongoose"

const quoteSchema = new Schema( {
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Quote = model( "Quote" , quoteSchema)

export default Quote;