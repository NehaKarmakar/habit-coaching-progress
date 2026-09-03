import {useState, useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import LoadingContext from "../../contexts/loadingContext"
import { toast } from "react-toastify"
export default function GroupEnrollment() {
    const [form, setForm] = useState( {
        memberName: "",
        serverError: ""
    })
    const navigate= useNavigate()
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
            toast("Enrollment Successfull")
            
             
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
        <div className="card">
             <CoachSidebar/>
        <div className="flex flex-col items-center gap-8 ">
          
            <h2 className="text-2xl font-semibold"> Add Member</h2>
            {form.serverError && <p  className="text-xl font-semibold text-red-700">{form.serverError}</p>}
            <div className="flex justify-center scale-110 ">
            <form onSubmit= {handleSubmit}>
                
                <label className="text-xl">Member Name: 
                    <input type= "text" name= "memberName" value= {form.memberName} onChange= {handleChange} placeholder=" Enter the Member Name"/>
                </label>
                <input type= "submit" value= "Add to the Group" className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700"/>
            </form>
        </div>
        </div>
        </div>
    )
}
