import {useState,useContext} from "react"
import axios from "../config/axios"
import LoadingContext from "../contexts/loadingContext"
import { toast } from "react-toastify"
export default function ForgetPassword () {
    const [form, setForm] = useState( {
        email: "",
        serverError: ""
    })
    const {setLoading} = useContext(LoadingContext)
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form, [name]:value, serverError: ""})
    }
    const formValidations = () =>{
         if(!form.email.trim()){
            setForm( {...form, serverError: "Email is required"})
            return false
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setForm( {...form, serverError: "Enter a valid email"})
        return false
        }
        return true
    }
    const handleSubmit= async  (e) => {
        e.preventDefault()
        if(!formValidations()){
            return
        }
        setLoading(true)
        
        try{
            const response= await axios.post("/api/auth/forgetPassword", {email: form.email})
            console.log(response.data)
            toast("Password reset link has been sent to your email.")
            setForm( {
                email:"",
                serverError: ""
            })
            

        }
        catch(err){
            console.log(err.response?.data?.message)
            setForm( {...form, serverError: err.response?.data?.message})
        }
        finally{
            setLoading(false)
        }
    }

    return(
         <div className="card">
        <div  className="flex flex-col items-center gap-8 ">
            <h2 className="text-2xl font-semibold">Forget Password</h2>
            {
                form.serverError && <p className="text-xl font-semibold text-red-700"> {form.serverError}</p>
            }
            <div className="flex justify-center scale-110 ">
            <form onSubmit= {handleSubmit}>
                <label className="text-xl">Email: 
                    <input type= "email" name="email" value= {form.email} onChange= {handleChange} placeholder="Enter your email"/>
                </label>
                <input type= "submit" className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700"/>
            </form>
        </div>
        </div>
        </div>
    )
}