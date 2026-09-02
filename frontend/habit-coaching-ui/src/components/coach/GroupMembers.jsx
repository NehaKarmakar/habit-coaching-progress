import {useState, useEffect,useContext} from "react"
import { useParams } from "react-router-dom"
import axios from "../../config/axios"
import LoadingContext from "../../contexts/loadingContext"
import CoachSidebar from "../CoachSidebar"
import {toast} from "react-toastify"
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
                  toast("Successfully deleted Member")
               

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
             
             <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    
                     {
                groupMembers.data.map( (ele) =>{
                    return (
                        
                            <tr>
                                <td>{ele.member.name}</td>
                                <td>{ele.member.email}</td>
                                <td>{ele.member.phone}</td>
                                <td>{new Date(ele.joinedAt).toLocaleDateString()}</td>
                                <td><button onClick={() => {handleDeleteMember(ele.member._id)}}>Delete Member</button></td>
                            </tr>

                            
                        
                    )
                } )
            }
            
                    
                </tbody>
             </table>

            
          
        </div>
    )
}