import {useState, useEffect,useContext} from "react"
import { useParams } from "react-router-dom"
import axios from "../../config/axios"
import LoadingContext from "../../contexts/loadingContext"
import CoachSidebar from "../CoachSidebar"

export default function MemberGroups (){
    const [memberGroups, setMemberGroups] = useState( {
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
                    const response= await axios.get(`/api/enrollments/member/${id}`, {headers: {Authorization: localStorage.getItem("token")}})
                    console.log(response.data)
                    setMemberGroups({...memberGroups, data: response.data.data})

                }
                catch(err){
                    console.log(err.response.data.message)
                    setMemberGroups( {...memberGroups, serverError: err.response.data.message})
                }
                finally{
                    setLoading(false)
                }
            }

        )()
    },[])

     return(
        <div className="flex min-h-screen gap-8">
              <CoachSidebar/>
              <div className="flex-1 p-4 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center">Members Group</h2>
            {memberGroups.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {memberGroups.serverError}</p>}
            <div className="card">
                {memberGroups.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No group found for this member.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
            <table className=" w-full  border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Group Name</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Joined At</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {
                        memberGroups.data.map( (ele) => {
                            return(
                                <tr key= {ele._id}>
                                    <td className="border border-black px-6 py-3 text-center  hover:bg-amber-200 scale-110">{ele.group?.groupName || "Group no longer exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele.group?.description ||"Group no longer exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{new Date(ele.joinedAt).toLocaleDateString()}</td>
                                </tr>
                            ) 
                        })
                    }
                </tbody>
            </table> 
            </div> 
        </div>
        </div>
        </div>
    )
}