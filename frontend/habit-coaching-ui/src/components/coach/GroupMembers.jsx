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
    if(!groupMembers.data){
        return <p>Loading</p>
    }

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
        <div  className="flex min-h-screen gap-4">
              <CoachSidebar/>
              <div className="flex-1 p-8  max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center">Group Members</h2>
            {groupMembers.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {groupMembers.serverError}</p>}
             <div className="card">
                {groupMembers.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No members found for this group.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
             <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Username</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Email</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Phone No.</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Joined Date</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Action</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    
                     {
                groupMembers.data.map( (ele) =>{
                    return (
                        
                            <tr key= {ele._id}>
                                <td className="border border-black px-6 py-3  text-center hover:scale-110">{ele.member?.name || "No longer member exists"}</td>
                                <td className="border border-black px-6 py-3  text-center hover:scale-110">{ele.member?.email || "No longer member exists"}</td>
                                <td className="border border-black px-6 py-3  text-center  hover:scale-110">{ele.member?.phone || "No longer member exists"}</td>
                                <td className="border border-black px-6 py-3  text-center hover:scale-110">{new Date(ele.joinedAt).toLocaleDateString()}</td>
                                <td className="border border-black px-6 py-3  text-center hover:scale-110"><button onClick={() => {handleDeleteMember(ele.member._id)}}>Delete Member</button></td>
                            </tr>

                            
                        
                    )
                } )
            }
            
                    
                </tbody>
             </table>
            </div>
          </div>  
         </div> 
        </div>
    )
}