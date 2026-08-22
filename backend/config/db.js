import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const configureDB = mongoose.connect(process.env.URL)
.then( () => {
    console.log("Successfully connected to the database")
})
.catch( () => {
    console.log("Database connection fails")
})

export default configureDB;