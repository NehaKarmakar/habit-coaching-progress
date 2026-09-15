import {useState} from "react"
import axios from "../config/axios"
import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import LoadingContext from "../contexts/loadingContext"
import { toast } from "react-toastify"

export default function Login() {
    const [form, setForm] = useState( {
        email: "",
        password:"",
        serverError:""
    })
    const {setLoading} = useContext(LoadingContext)
    const {handleLogin} = useContext(AuthContext)
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form , [name] : value, serverError:""})
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
        if(!form.password.trim()){
            setForm( {...form, serverError: "Password is required"})
            return false
        }
       
       
        return true
    }
    const handleSubmit= async (e) => {
        e.preventDefault()
      
       if(!formValidations()) {
        return
       }
       setLoading(true)
       try{
        const response= await axios.post("/api/auth/login",
            {
                email: form.email,
                password: form.password

            })
        const {token, user} = response.data
        console.log("token", response.data.token)
        console.log("user", response.data.user)
        handleLogin(token,user)
       
        setForm( {
            email:"",
            password:"",
            serverError:""
        })
        toast("Login Successfull")

       }
       catch(err){
        console.log(err.response)
        setForm( {...form, serverError: err.response?.data?.message})
       }
       finally{
        setLoading(false)
       }

    }
    return(
        <div className="card">
        <div className="flex flex-col items-center gap-8 ">
            <h2 className="text-2xl font-semibold">Login Form</h2>
            {
                form.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {form.serverError}</p>
            }
            <div className="flex justify-center scale-110  max-sm:scale-100 max-sm:w-full max-sm:px-4 ">
            <form onSubmit= {handleSubmit}>
                <label className="text-xl max-sm:text-lg">Email: 
                    <input  type= "email" name= "email"value={form.email} onChange= {handleChange} placeholder="Enter your email"/>
                    </label>
                <label className="text-xl max-sm:text-lg">Password: 
                    <input  type= "password" name= "password" value={form.password} onChange={handleChange} placeholder="Enter your password"/>
                </label>
                <Link to ="/user/forgetPassword" >Forget Password?</Link>
                <input type= "submit" value="login"  className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700"/>
            </form>
            </div>
        </div>
        </div>
    )
}