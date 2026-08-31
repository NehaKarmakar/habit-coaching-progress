import {useState,useContext} from "react"
import {useNavigate} from "react-router-dom"
import LoadingContext from "../contexts/loadingContext"
import axios from "axios"
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
            const response= await axios.post("http://localhost:5555/api/auth/register",
                 {
                     name: form.name,
                     email: form.email,
                     phone: form.phone,
                     password: form.password
             })
            console.log(response.data.data)
            alert(response.data.message)
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
        setLoading(true)
        try{

            const response= await axios.get(`http://localhost:5555/api/auth/check-field?field=${name}&value=${value}`)
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
        <div>
            <h2>Register</h2>
            {
                form.serverError && <p>{form.serverError}</p>
            }
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
                <label> Phone:
                    <input type= "text" name= "phone" value= {form.phone} onChange= {handleChange}/>
                </label>
              <label>Password:
                <input type= "password" name= "password" value= {form.password} onChange= {handleChange}/><br/><br/>
                </label>
                <input type= "submit" value= "register"/>
            </form>
        </div>
    )
}