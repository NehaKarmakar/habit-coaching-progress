import {useState,useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import axios from "../config/axios"
import AuthContext from "../contexts/AuthContext"
import LoadingContext from "../contexts/loadingContext"
import { toast } from "react-toastify"
export default function UpdateProfile() {
    const { user, dispatch } = useContext(AuthContext); 
    const [form, setForm] = useState( {
        name:"",
        email:"",
        phone:"",
        
        serverError:"",
        checkError:{}
    })
    const {setLoading} = useContext(LoadingContext)
    useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
       
        serverError: "",
        checkError: {}
      });
    }
  }, [user]);
    
    const navigate= useNavigate()
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form , [name]: value, serverError: ""})

    }
    const formValidations = () => {
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
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
       
        if(!formValidations()) {
            return
        }
        // Only include the password if the user actually typed a new one
        setLoading(true)
        
        try{
            const response= await axios.put("/api/auth/update",{
                name: form.name,
                email:form.email,
                phone: form.phone
            }, {headers: {Authorization:localStorage.getItem("token")}})
            console.log(response.data.data)
           
          const updatedUser = response.data.data || response.data;
             dispatch({ type: "UPDATE_PROFILE", payload: updatedUser });
             toast("Profile updated Successfully")
            if (user?.role === "coach") {
        navigate("/coach/dashboard");
      } else {
        navigate("/member/dashboard");
      }
        
    

        }
        catch(err){
            console.log(err.response.message)
            setForm({...form, serverError: err.response?.data?.message})
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
            <h2>Update Profile</h2>
            {
                form.serverError && <p> {form.serverError}</p>
                
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
              
                <input type= "submit" value= "update"/>
            </form>
        </div>
    )
}