import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import HabitContext from "../../contexts/HabitContex"
import HabitForm from "./HabitForm"
import LoadingContext from "../../contexts/loadingContext"
import { toast } from "react-toastify"

export default function Habits (){
    const [habits, setHabits] = useState( {
        data:[],
        serverError:"",
        search:"",
        page:1,
        sort:"createdAt",
        order:"desc",
        totalPages:1,
        editId:null

    })
    
  const {setLoading} = useContext(LoadingContext)
    
    useEffect( () => {

        (
          async function fetchHabits() {
            setLoading(true)
            try{
            const response= await axios.get("/api/habits/habitAggregate",{
                params:{
                    search: habits.search,
                    page:habits.page,
                    limit:5,
                    sort:habits.sort,
                    order:habits.order
                   
                 } ,headers: {Authorization: localStorage.getItem("token")}}) 
                console.log("serach,sort,pagination",response.data)
                setHabits( {...habits, data: response.data.data, totalPages: response.data.totalPages})
            }
            catch(err){
                console.log(err.response?.data?.message)
                setHabits( {...habits , serverError: err.response?.data?.message})
            }
            finally{
                setLoading(false)
            }
          }
        )()

    },[habits.search, habits.page, habits.sort,habits.order])
   
    const deleteHabit = (id) => {
        const filterArr = habits.data.filter( (habit) => {
            return habit._id !== id
        })
        setHabits( {...habits, data: filterArr})
    }
    const addHabit= (habit) => {
        setHabits( {...habits, data: [...habits.data, habit]})
    }
    const assignedEditId =(id) => {
        setHabits( {...habits, editId: id})
    }
    const editHabit = (habit) => {
    setHabits(prev => ({
        ...prev,
        data: prev.data.map(ele =>
            ele._id === habit._id ? habit : ele
        )
    }))
}
    
   
    
    const handleDelete = async (habitId) => {
        console.log("deletingId", habitId)
        const confirmation= window.confirm("Are you sure you want to delete the habit?")
        if(!confirmation){
            return
        }
        setLoading(true)
        try{
            
            const response= await axios.delete(`/api/habits/${habitId}`, {headers: {Authorization:localStorage.getItem("token")}})
            console.log(response.data)
            deleteHabit(habitId)
            toast("Successfully deleted habit")

        }
        catch(err){
            console.log(err.response.data)
            setHabits( {...habits, serverError: err.response.data.message})
        }
        finally{
            setLoading(false)
        }
    }
    return(
        <div className="flex min-h-screen gap-4">
            <CoachSidebar/>
            <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold text-center"> Habits</h2> <br/>
            {
                habits.serverError && <p className="text-xl font-semibold text-red-700"> {habits.serverError}</p>
            }
         
       
        <input type= "text" value= {habits.search} onChange= { (e) => {setHabits({...habits, search: e.target.value, page: 1})}} placeholder="Search by title"/><br/>
         <label className=" font-semibold m-3 p-4">Sort By: 
        <select value= {habits.sort} onChange={ (e) => {setHabits( {...habits, sort: e.target.value, page: 1})}}>
            <option value= "">Select</option>
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value= "frequency">Frequency</option>
            <option value= "difficulty">Difficulty</option>

        </select>
        </label>

         <label className="font-semibold m-3 p-4">Order:
        <select value= {habits.order} onChange= { (e) => {setHabits( {...habits, order: e.target.value, page: 1 })}}>
            <option value= "">Select</option>
            <option value="asc">Ascending</option>
            <option value= "desc">Descending</option>
          
        </select>
        </label> <br/><br/>
        <table className="  border-collapse border">
                <thead className="bg-blue-500 text-white" >
                 <tr>
                   
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Title</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Frequency</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Difficulty</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Group Name</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Resource</th>
                    <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Actions</th>
                 </tr>
                </thead>
                <tbody className="text-black ">
                 
                        {
                           habits.data.map( (habit) => {
                                return(
                                      <tr key= {habit._id}>
                                        
                                        <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{habit.title}</td>
                                        <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{habit.description}</td>
                                        <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{habit.frequency}</td>
                                        <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{habit.difficulty}</td>
                                         <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{habit.group?.groupName ||  "No group"}</td>
                                         <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">
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
            <td className="border border-black px-6 py-3 hover:scale-110">
                                         <button onClick= { () =>assignedEditId(habit._id) } className="m-2" >Edit</button>
                                         <button onClick= { () => {handleDelete(habit._id)}}>Delete</button>
                                         </td>
                                    
                                    </tr>
                                    
                                )
                            })
                        }
                        
                      
                   
                </tbody>
            </table>

            <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled ={habits.page===1} onClick= { () => {setHabits({...habits, page: habits.page-1})}}>previous</button>
            <span> {habits.page} of {habits.totalPages}</span>
            <button disabled= {habits.page===habits.totalPages} onClick= { () => {setHabits({...habits, page: habits.page+1})}}>next</button>
            
            </div>
            </div>
          <HabitContext.Provider value= { {data: habits.data , addHabit: addHabit, editId: habits.editId, assignedEditId:assignedEditId ,editHabit:editHabit}} >
            <HabitForm className= "!w-80 p-6"/>
          </HabitContext.Provider>
    
        
        </div>
        
    )
}