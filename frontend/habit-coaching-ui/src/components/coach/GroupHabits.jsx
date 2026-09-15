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
        
        <div className="flex min-h-screen gap-4">
            {user?.role==="coach" ?  <CoachSidebar/> : <MemberSidebar/> }
            <div className="flex-1 max-sm:min-w-0 p-8 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center"> Group Habits</h2> <br/>
            {groupHabits.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {groupHabits.serverError}</p>} <br/>
            <div className="card">
                {groupHabits.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No habits found for this group.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Title</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md ">Frequency</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Difficulty</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Resource</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {
                        groupHabits.data.map( (habit) => {
                      return(
                      <tr key= {habit._id} >
                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit?.title || "No longer habit exists"}</td>
                        <td className="border border-black  px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit?.description ||"No longer habit exists"}</td>
                        <td className="border border-black  px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit?.frequency ||"No longer habit exists"}</td>
                        <td className="border border-black  px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit?.difficulty || "No longer habit exists"}</td>
                        
                        <td className="border border-black px-6 py-3 hover:bg-amber-200 scale-110">
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
                ) }
            </td>
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