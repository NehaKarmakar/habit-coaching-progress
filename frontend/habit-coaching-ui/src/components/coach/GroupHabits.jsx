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
            {
                groupHabits.data.map( (habit) => {
                    return(
                        <div>
                        <h3>{habit.title}</h3>
                        <p> Description: {habit.description}</p>
                        <p> Frequency: {habit.frequency}</p>
                        <p> Difficulty: {habit.difficulty}</p>
                        
                        </div>
                    )
                })
            }
        </div>
    )
}