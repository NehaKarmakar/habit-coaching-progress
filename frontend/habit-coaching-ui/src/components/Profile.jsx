import AuthContext from "../contexts/AuthContext"
import { useContext , useState} from "react"
import {useNavigate} from "react-router-dom"
import CoachSidebar from "./CoachSidebar"
import MemberSidebar from "./memberSidebar"
import { toast } from "react-toastify"
import axios from "../config/axios"
export default function Profile(){
    const {user,dispatch} = useContext(AuthContext)
    const [serverError, setServerError] = useState("")
    const navigate= useNavigate()
    if(!user) {
        return <p>Loading...</p>
    }
    const handleUpdate= (id) => {
        console.log("update")
        navigate(`/profile/update/${id}`)
        
    }

    const handleDelete= async (id) => {
        const confirmation= window.confirm("Are you sure you want to delete your account?")
        if(!confirmation){
            return 
        }
        try{
            const response= await axios.delete("/api/auth/deleteAccount", {headers: {Authorization: localStorage.getItem("token")}})
            console.log(response.data)
             dispatch( {type:"DELETE_ACCOUNT"})
             localStorage.removeItem("token")
             toast("Successfully account deleted")
       
        navigate("/login")

        }
        catch(err) {
            console.log(err.response?.data?.message)
            setServerError(err.response?.data?.message)

        }
    }
    return(
          <div className="card">
        <div className="flex min-h-screen gap-8">
          
            {
                user?.role==="coach"? <CoachSidebar/> : <MemberSidebar/>
            }
             <div className="flex-1 p-6 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center">Profile</h2>
            <br/>
            {serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700">{serverError}</p>}
            <br/>
            <div className="max-w-md mx-auto bg-indigo-800 text-white border-2 rounded-lg p-6 max-sm:p-4 hover:bg-blue-900 scale-95 text-white shadow-md">
            <p className="text-xl max-sm:text-base font-semibold ">Username: {user.name}</p>
            <p className="text-xl max-sm:text-base font-semibold ">Email: {user.email}</p>
            <p className="text-xl max-sm:text-base font-semibold ">Phone No. : {user.phone}</p>
            <p className="text-xl max-sm:text-base font-semibold ">Role: {user.role}</p>
            <br/>
            <button onClick= {() => {handleUpdate(user._id)} } className="text-center m-4">Edit Profile</button>
            <button onClick= { () => {handleDelete(user._id)}} className="text-center">Delete Account</button>
        </div>
        </div>
        </div>
        </div>
    )
}