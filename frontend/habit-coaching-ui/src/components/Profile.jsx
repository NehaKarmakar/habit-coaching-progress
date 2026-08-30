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
        <div>
            {
                user?.role==="coach"? <CoachSidebar/> : <MemberSidebar/>
            }
            <h2>Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Role: {user.role}</p>
            <button onClick= {() => {handleUpdate(user._id)}}>Edit Profile</button>
        </div>
    )
}