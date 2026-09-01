import { useParams } from "react-router-dom"
import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import AuthContext from "../../contexts/AuthContext"
import MemberSidebar from "../memberSidebar"
import LoadingContext from "../../contexts/loadingContext"
export default function GroupHabits() {
    const {id} = useParams()
    const [groupHabits, setGroupHabits] = useState({
        data: [],
        serverError: ""
    })
    const {user} = useContext(AuthContext)
    const {setLoading} = useContext(LoadingContext)
    useEffect( () => {
      (
          async function fetchGroupHabits(){
            setLoading(true)
            try{
              const response= await axios.get(`/api/groups/habits/${id}`, {headers: {Authorization: localStorage.getItem("token")}})
              console.log(response.data.data)
              setGroupHabits( {...groupHabits, data: response.data.data})
            }
            catch(err){
                console.log(err.response.data)
                setGroupHabits({...groupHabits, serverError: err.response.data.message})
            }
            finally{
                setLoading(false)
            }
          }
      )()
    },[])

    if(!id){
        return <p>Loading...</p>
    }
    return(
        <div>
            {user?.role==="coach" ?  <CoachSidebar/> : <MemberSidebar/> }
          
            <h2> Group Habits</h2>
            {groupHabits.serverError && <p> {groupHabits.serverError}</p>}
           
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Frequency</th>
                        <th>Difficulty</th>
                        <th>Resource</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        groupHabits.data.map( (habit) => {
                      return(
                      <tr key= {habit._id}>
                        <td>{habit.title}</td>
                        <td>{habit.description}</td>
                        <td>{habit.frequency}</td>
                        <td>{habit.difficulty}</td>
                        <td>{habit.resource}</td>
                        <td>
                {habit.resourceUrl ? (
                    <a
                        href={habit.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {habit.resourceName || "View Resource"}
                    </a>
                ) : (
                    "No resource"
                )}
            </td>
                      </tr>
                        
                        
                       
                    )
                })
            }

                    
                </tbody>
            </table>
        </div>
    )
}