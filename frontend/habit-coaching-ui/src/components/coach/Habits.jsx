import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import HabitContext from "../../contexts/HabitContex"
import HabitForm from "./HabitForm"
import LoadingContext from "../../contexts/loadingContext"

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
    const editHabit= (habit) => {
     const result= habits.data.map( (ele) => {
        if(ele._id===habit._id){
            return {...habit}
        }
        else{
            return{...ele}
        }
     })
     setHabits( {...habits, data: result})
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
        <div>
            <CoachSidebar/>
            <h2> Habits</h2>
            {
                habits.serverError && <p> {habits.serverError}</p>
            }
           
        <h2>Habit Table</h2>
        <input type= "text" value= {habits.search} onChange= { (e) => {setHabits({...habits, search: e.target.value, page: 1})}} placeholder="Search by title"/>
        <select value= {habits.sort} onChange={ (e) => {setHabits( {...habits, sort: e.target.value, page: 1})}}>
            <option value= "">Select</option>
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value= "frequency">Frequency</option>
            <option value= "difficulty">Difficulty</option>

        </select>
        <select value= {habits.order} onChange= { (e) => {setHabits( {...habits, order: e.target.value, page: 1 })}}>
            <option value= "">Select</option>
            <option value="asc">Ascending</option>
            <option value= "desc">Descending</option>

        </select>
        <table>
                <thead>
                 <tr>
                   
                    <th>Title</th>
                    <th>Description</th>
                    <th>Frequency</th>
                    <th>Difficulty</th>
                    <th>Group Name</th>
                    <th>Resource</th>
                 </tr>
                </thead>
                <tbody>
                 
                        {
                           habits.data.map( (habit) => {
                                return(
                                      <tr key= {habit._id}>
                                        
                                        <td>{habit.title}</td>
                                        <td>{habit.description}</td>
                                        <td>{habit.frequency}</td>
                                        <td>{habit.difficulty}</td>
                                         <td>
                                            {
                                                habit.GroupDetails?.map((ele) => {
                                                    return <span key= {ele._id}>{ele.groupName}</span>
                                                })
                                            }
                                         
                                         </td>
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
                                         <button onClick= { () =>assignedEditId(habit._id)} >Edit</button>
                                         <button onClick= { () => {handleDelete(habit._id)}}>Delete</button>
                                    </tr>
                                    
                                )
                            })
                        }
                        
                      
                   
                </tbody>
            </table>
            <button disabled ={habits.page===1} onClick= { () => {setHabits({...habits, page: habits.page-1})}}>previous</button>
            <span> {habits.page} of {habits.totalPages}</span>
            <button disabled= {habits.page===habits.totalPages} onClick= { () => {setHabits({...habits, page: habits.page+1})}}>next</button>
            
       
          <HabitContext.Provider value= { {data: habits.data , addHabit: addHabit, editId: habits.editId, assignedEditId:assignedEditId ,editHabit:editHabit}} >
            <HabitForm/>
          </HabitContext.Provider>
        </div>
        
    )
}