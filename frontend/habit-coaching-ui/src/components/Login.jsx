import {useState} from "react"
import axios from "axios"
import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
export default function Login() {
    const [form, setForm] = useState( {
        email: "",
        password:"",
        serverError:""
    })
    const {handleLogin} = useContext(AuthContext)
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form , [name] : value})
    }
    const handleSubmit= async (e) => {
        e.preventDefault()
       // http://localhost:5555/api/auth
       try{
        const response= await axios.post("http://localhost:5555/api/auth/login",form)
        const {token, user} = response.data
        console.log("token", response.data.token)
        console.log("user", response.data.user)
        handleLogin(token,user)

       }
       catch(err){
        console.log(err.response)
        setForm( {...form, serverError: err.response})
       }

    }
    return(
        <div>
            <h2>Login Component</h2>
            <form onSubmit= {handleSubmit}>
                <label>Email: 
                    <input type= "email" name= "email"value={form.email} onChange= {handleChange} />
                    </label> <br/><br/>
                <label>Password: 
                    <input type= "password" name= "password" value={form.password} onChange={handleChange} />
                </label><br/><br/>
                <input type= "submit" value="login"/>
            </form>
        </div>
    )
}