import {useState,useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import axios from "../config/axios"
import AuthContext from "../contexts/AuthContext"
export default function UpdateProfile() {
    const { user, dispatch } = useContext(AuthContext); 
    const [form, setForm] = useState( {
        name:"",
        email:"",
        phone:"",
        
        serverError:"",
        checkError:{}
    })
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
        setForm( {...form , [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
       
        
        // Only include the password if the user actually typed a new one
        
        try{
            const response= await axios.put("/api/auth/update",form, {headers: {Authorization:localStorage.getItem("token")}})
            console.log(response.data.data)
           
          const updatedUser = response.data.data || response.data;
             dispatch({ type: "UPDATE_PROFILE", payload: updatedUser });
            if (user?.role === "coach") {
        navigate("/coach/dashboard");
      } else {
        navigate("/member/dashboard");
      }
        
    

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
           
         

        }
        catch(err){
            console.log(err.response.data)
            setForm({...form , checkError: err.response.data})
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