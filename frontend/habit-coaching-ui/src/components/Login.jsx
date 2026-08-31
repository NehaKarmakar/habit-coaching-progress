import {useState} from "react"
import axios from "axios"
import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import LoadingContext from "../contexts/loadingContext"
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
        setForm( {...form , [name] : value})
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
       // http://localhost:5555/api/auth
       if(!formValidations()) {
        return
       }
       setLoading(true)
       try{
        const response= await axios.post("http://localhost:5555/api/auth/login",
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
        <div>
            <h2>Login Component</h2>
            {
                form.serverError && <p> {form.serverError}</p>
            }
            <form onSubmit= {handleSubmit}>
                <label>Email: 
                    <input type= "email" name= "email"value={form.email} onChange= {handleChange} />
                    </label> <br/><br/>
                <label>Password: 
                    <input type= "password" name= "password" value={form.password} onChange={handleChange} />
                </label><br/><br/>
                <Link to ="/user/forgetPassword">Forget Password</Link>
                <input type= "submit" value="login"/>
            </form>
        </div>
    )
}