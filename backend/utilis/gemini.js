import {GoogleGenAI} from "@google/genai"
import dotenv from "dotenv"
dotenv.config()

const ai = new GoogleGenAI( {
    apiKey: process.env.GEMINI_API_KEY
})

export const genrateHabitAdvice= async(prompt) => {
   try{
    const response= await ai.models.generateContent( {
        model:"gemini-3.6-flash",
        contents: prompt
    })
    return response.text || "Keep going! Small consistent habits lead to big results."

   }
    catch(err){
        console.error("Critical error detected", err)
        return "Keep going! Small consistent habits lead to big results."
    }
}
