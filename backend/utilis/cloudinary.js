import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFile = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream= cloudinary.uploader.upload_stream( {
            resource_type: "raw",
            folder: "Habit Resources"
        },
        (error,result) => {
            if(error){
                reject(error)
            }
            else{
                resolve(result)
            }
        }
    )
    stream.end(buffer)
})

}

export default uploadFile