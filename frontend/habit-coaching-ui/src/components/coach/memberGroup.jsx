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
        <div>
              <CoachSidebar/>
            <h2>Members Group</h2>
            {memberGroups.serverError && <p> {memberGroups.serverError}</p>}
            
            <table>
                <thead>
                    <tr>
                    <th>Group Name</th>
                    <th>Description</th>
                    <th>Joined At</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        memberGroups.data.map( (ele) => {
                            return(
                                <tr>
                                    <td>{ele.group.groupName}</td>
                                    <td>{ele.group.description}</td>
                                    <td>{new Date(ele.joinedAt).toLocaleDateString()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>  
        </div>
    )
}