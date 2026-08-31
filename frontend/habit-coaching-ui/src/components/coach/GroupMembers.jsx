import {useState, useEffect,useContext} from "react"
import { useParams } from "react-router-dom"
import axios from "../../config/axios"
import LoadingContext from "../../contexts/loadingContext"
import CoachSidebar from "../CoachSidebar"
export default function GroupMembers (){
    const [groupMembers, setGroupMembers] = useState( {
        data: [],
        serverError: ""
    })

    const {id}   = useParams()
    const {setLoading} = useContext(LoadingContext)
    useEffect( () =>{
        (
            async function fetchGroupMembers() {
                setLoading(true)
                try{
                    const response= await axios.get(`/api/enrollments/group/${id}`, {headers: {Authorization: localStorage.getItem("token")}})
                    console.log(response.data.data)
                    setGroupMembers({...groupMembers, data: response.data.data})

                }
                catch(err){
                    console.log(err.response.data.message)
                    setGroupMembers( {...groupMembers, serverError: err.response.data.message})
                }
                finally{
                    setLoading(false)
                }
            }

        )()
    },[])

    const deleteMember= (id) => {
        const filterArr = groupMembers.data.filter((ele) => {
            return ele.member._id !== id
        })
      setGroupMembers({...groupMembers, data: filterArr})
    }

    const handleDeleteMember = async(id) => {
        console.log("deleting id" , id)
        const confirmation= window.confirm("Are you sure you want to delete the member?")
               if(!confirmation){
                return
               }
             try{
               const response= await axios.delete(`/api/enrollments/${id}`, {headers: {Authorization: localStorage.getItem("token")}})
               
               
                  deleteMember(id)
               

             }
             catch(err){
                console.log(err.response.data.message)
                setGroupMembers( {...groupMembers, serverError: err.response.data.message})
             }
    }
    
    
    return(
        <div>
              <CoachSidebar/>
            <h2>Group Members</h2>
            {groupMembers.serverError && <p> {groupMembers.serverError}</p>}


            {
                groupMembers.data.map( (ele) =>{
                    return (
                        <div>
                            <h3>Name:{ele.member.name}</h3>
                            <p>Enrollment Id: {ele._id}</p>
                            <p>Id: {ele.member._id}</p>
                            <p>Email:{ele.member.email}</p>
                            <p>Phone:{ele.member.phone}</p>
                            <p>Role: {ele.member.role}</p>
                            <p>Joined Date : {new Date(ele.joinedAt).toLocaleDateString()}</p>
                            <button onClick={() => {handleDeleteMember(ele.member._id)}}>Delete Member</button>
                        </div>
                    )
                } )
            }
            
            
          
        </div>
    )
}