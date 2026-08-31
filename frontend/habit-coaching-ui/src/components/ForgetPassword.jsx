import {useState,useContext} from "react"
import axios from "../config/axios"
import LoadingContext from "../contexts/loadingContext"
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
            alert(response.data.message)
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
        <div>
            <h2>Forget Password</h2>
            {
                form.serverError && <p> {form.serverError}</p>
            }
            <form onSubmit= {handleSubmit}>
                <label>Email: 
                    <input type= "email" name="email" value= {form.email} onChange= {handleChange} placeholder="Enter your email"/>
                </label>
                <input type= "submit"/>
            </form>
        </div>
    )
}