import {useState} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
export default function Register() {
    const [form, setForm] = useState( {
        name:"",
        email:"",
        password:"",
        serverError:"",
        checkError:{}
    })
    
    const navigate= useNavigate()
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form , [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response= await axios.post("http://localhost:5555/api/auth/register",form)
            console.log(response.data.data)
            alert(response.data.message)
            navigate("/login")
 

        }
        catch(err){
            console.log(err.response.message)
            return {...form, serverError: err.response.message}
        }
    }
    const handleCheck= async (e) => {
        const {name, value} = e.target
        try{

            const response= await axios.get(`http://localhost:5555/api/auth/check-field?field=${name}&value=${value}`)
           console.log(response.data)
           setForm({...form, checkError:{} })

        }
        catch(err){
            console.log(err.response.data)
            setForm({...form , checkError: err.response.data})
        }
    }

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit= {handleSubmit}>
              
               <label>Username: 
                <input type= "text" name="name" value= {form.name} onChange= {handleChange} onBlur= {handleCheck}/> 
                {form.checkError.field=== "name" && <span>Username already taken</span>}
                <br/><br/>
                </label>
              <label>Email:
                <input type= "email" name= "email" value= {form.email} onChange= {handleChange} onBlur= {handleCheck}/>
                {form.checkError.field=== "email" && <span>Email is already taken</span>}
                <br/><br/>
                </label>
              <label>Password:
                <input type= "password" name= "password" value= {form.password} onChange= {handleChange}/><br/><br/>
                </label>
                <input type= "submit" value= "register"/>
            </form>
        </div>
    )
}