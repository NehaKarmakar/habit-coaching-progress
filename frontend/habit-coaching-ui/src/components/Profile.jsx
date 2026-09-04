import AuthContext from "../contexts/AuthContext"
import { useContext } from "react"
import {useNavigate} from "react-router-dom"
import CoachSidebar from "./CoachSidebar"
import MemberSidebar from "./memberSidebar"
export default function Profile(){
    const {user} = useContext(AuthContext)
    const navigate= useNavigate()
    if(!user) {
        return <p>Loading...</p>
    }
    const handleUpdate= (id) => {
        console.log("update")
        navigate(`/profile/update/${id}`)
        
    }
    return(
          <div className="card">
        <div className="flex min-h-screen gap-8">
          
            {
                user?.role==="coach"? <CoachSidebar/> : <MemberSidebar/>
            }
             <div className="flex-1 p-6 ">
            <h2 className="text-2xl font-semibold text-center">Profile</h2>
            <br/>
            <div className="max-w-md mx-auto bg-indigo-800 text-white border-2 rounded-lg p-6 hover:bg-blue-900 scale-95 text-white shadow-md">
            <p className="text-xl font-semibold ">Username: {user.name}</p>
            <p className="text-xl font-semibold ">Email: {user.email}</p>
            <p className="text-xl font-semibold ">Phone No. : {user.phone}</p>
            <p className="text-xl font-semibold ">Role: {user.role}</p>
            <br/>
            <button onClick= {() => {handleUpdate(user._id)} } className="text-center">Edit Profile</button>
        </div>
        </div>
        </div>
        </div>
    )
}