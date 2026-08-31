import {useState, useEffect, useContext} from "react"
import { useParams } from "react-router-dom"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import LoadingContext from "../../contexts/loadingContext"

export default function GroupEnrollment() {
    const [form, setForm] = useState( {
        memberName: "",
        serverError: ""
    })
   const {id} = useParams()
   const {setLoading} = useContext(LoadingContext)
    const handleChange= (e) => {
        const {name, value} = e.target
        setForm( {...form, [name]:value, serverError: ""} )
    }

    const formValidations= () => {
        if(!form.memberName.trim()) {
            setForm( {...form, serverError: "Member name is required"})
            return false
        }
        return true
    }

    const handleSubmit= async(e) => {
        e.preventDefault()
        if(!formValidations()) {
            return
        }
        setLoading(true)
        try{
            const response= await axios.post("/api/enrollments", {group:id, memberName:form.memberName}, {headers: {Authorization: localStorage.getItem("token")}})
            console.log(response.data)
            if(response.data.success) {
            setForm( {
                memberName: "",
                serverError: ""
            })
        }
            

        }
        catch(err){
            console.log(err.response?.data?.message)
            setForm({...form, serverError: err.response?.data?.message})
        }
        finally{
            setLoading(false)
        }

    }
    return (
        <div>
           <CoachSidebar/>
            <h3> Add Member</h3>
            {form.serverError && <p>{form.serverError}</p>}
            <form onSubmit= {handleSubmit}>
                
                <label>Member Name: 
                    <input type= "text" name= "memberName" value= {form.memberName} onChange= {handleChange} placeholder=" Enter the Member Name"/>
                </label>
                <input type= "submit" value= "Add to the Group"/>
            </form>
        </div>
    )
}
