import {useState,useContext} from "react"
import {useNavigate} from "react-router-dom"
import LoadingContext from "../contexts/loadingContext"
import axios from "../config/axios"
import { toast } from "react-toastify"
export default function Register() {
    const [form, setForm] = useState( {
        name:"",
        email:"",
        phone:"",
        password:"",
        serverError:"",
        checkError:{}
    })
    const {setLoading} = useContext(LoadingContext)
    const navigate= useNavigate()
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form , [name]: value, serverError:""})
        
    }

    const  formValidations = () => {
        if(!form.name.trim()){
            setForm( {...form, serverError: "Name is required"})
            return false
        }
        else if(form.name.trim().length<3) {
            setForm( {...form, serverError: "Name must be altleast 3 characters"})
            return false
        }
        

        if(!form.email.trim()){
            setForm( {...form, serverError: "Email is required"})
            return false
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setForm( {...form, serverError: "Enter a valid email"})
        return false
        }

        if(!form.phone.trim()){
            setForm( {...form, serverError: "Phone is required"})
            return false
        }
        else if (!/^[0-9]{10}$/.test(form.phone)) {
         setForm( {...form, serverError: "Phone must be 10 digits"})
         return false
        }  
        
        if(!form.password.trim()){
            setForm( {...form, serverError: "Password is required"})
            return false
        }
        else if(form.password.trim().length<8){
            setForm( {...form, serverError: "Password must be atleast 8 charaters"})
            return false
        }
        else if(!/[A-Z]/.test(form.password)){
            setForm( {...form, serverError: "Password must contain at least one uppercase letter"})
            return false
        }
        else if(!/[a-z]/.test(form.password)){
            setForm( {...form, serverError:"Password must contain at least one lowercase letter"})
            return false
        }
        else if(!/[0-9]/.test(form.password)){
            setForm( {...form, serverError:"Password must contain at least one number" })
            return false
        }
        else if(!/[!@#$%^&*]/.test(form.password)) {
            setForm( {...form, serverError: "Password must contain at least one special charaters"})
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!formValidations()){
            return
        }
        setLoading(true)
        try{
            const response= await axios.post("/api/auth/register",
                 {
                     name: form.name,
                     email: form.email,
                     phone: form.phone,
                     password: form.password
             })
            console.log(response.data.data)
            toast("Registered Successsfully")
            setForm( {
                name: "",
                email: "",
                phone:"",
                password: "",
                serverError: "",
                checkError:{}

            })
            navigate("/login")
 

        }
        catch(err){
            console.log(err.response?.data?.message)
            setForm( {...form, serverError: err.response?.data?.message})
        }
        finally{
            setLoading(false)
        }
    }
    const handleCheck= async (e) => {
        const {name, value} = e.target
        if (!value.trim()) {
        return
    }
        setLoading(true)
        try{

            const response= await axios.get(`/api/auth/check-field?field=${name}&value=${value}`)
           console.log(response.data)
           setForm({...form, checkError:{} })

        }
        catch(err){
            console.log(err.response?.data)
            setForm({...form , checkError: err.response?.data})
        }
        finally{
            setLoading(false)
        }
    }

    return(
         <div className="card">
        <div className="flex flex-col items-center gap-8 ">
            <h2 className="text-2xl font-semibold">Register</h2>
            {
                form.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700">{form.serverError}</p>
            }
            <div className="flex justify-center scale-110 max-sm:scale-100 max-sm:w-full max-sm:px-4  ">
            <form onSubmit= {handleSubmit} >
              
               <label className="text-xl max-sm:text-lg">Username: 
                <input className="max-sm:w-full" type= "text" name="name" value= {form.name} onChange= {handleChange} onBlur= {handleCheck} placeholder="Username must be unique"/> 
                {form.checkError.field=== "name" && <span className="text-xl max-sm:text-base font-semibold text-red-700">Username already taken</span>}
                
                </label>
              <label className="text-xl max-sm:text-lg">Email:
                <input className="max-sm:w-full" type= "email" name= "email" value= {form.email} onChange= {handleChange} onBlur= {handleCheck} placeholder="Enter your email"/>
                {form.checkError.field=== "email" && <span className="text-xl max-sm:text-base font-semibold text-red-700">Email is already taken</span>}
                
                </label>
                <label className="text-xl max-sm:text-lg "> Phone No. :
                    <input className="max-sm:w-full" type= "text" name= "phone" value= {form.phone} onChange= {handleChange} placeholder="Enter your phone number"/>
                </label>
              <label className="text-xl max-sm:text-lg">Password:
                <input className="max-sm:w-full" type= "password" name= "password" value= {form.password} onChange= {handleChange} placeholder="Enter your password"/><br/><br/>
                </label>
                <input type= "submit" value= "register" className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700"/>
            </form>
        </div>
        </div>
        </div>
    )
}