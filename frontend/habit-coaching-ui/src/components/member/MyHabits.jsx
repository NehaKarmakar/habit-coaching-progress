import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import LoadingContext from "../../contexts/loadingContext"
export default function MyHabits() {
    const [myHabits, setMyHabits] = useState( {
        data: [],
        search:"",
        page:1,
        sort:"createdAt",
        order:"desc",
        totalPages: 1
    })
   
    const [serverError, setServerError] = useState("")
    const [progress, setProgress] = useState( 
        JSON.parse(localStorage.getItem("progress")) || {}
    )
    const {setLoading} = useContext(LoadingContext)
    useEffect( () => {

        (
            async function  habits() {
                setLoading(true)
                try{
                    const response= await axios.get("/api/assignedHabitsAggregate", {
                        params: {
                            search: myHabits.search,
                            page: myHabits.page,
                            sort:myHabits.sort,
                            order: myHabits.order,
                            limit:5
                        },
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    })
                    console.log(response.data)
                    setMyHabits( {...myHabits, data: response.data.data, totalPages: response.data.totalPages})

                }
                catch(err){
                    console.log(err.response?.data?.message)
                    setServerError(err.response?.data?.message)
                }
                finally{
                    setLoading(false)
                }
            }

        )()

    },[myHabits.search, myHabits.page, myHabits.sort, myHabits.order])

    const handleCheck= (habitId) =>{
        const newProgress= {
            ...progress,
            [habitId]: !progress[habitId]
        }
        setProgress(newProgress)
        localStorage.setItem("progress", JSON.stringify(newProgress))
       
        markComplete(habitId)
    }

    const markComplete= async(habitId) => {
        setLoading(true)
            try{
                const response= await axios.post("/api/progress" , {habit: habitId} , {headers: {Authorization:localStorage.getItem("token")}})
                console.log(response.data)
                const updatedProgress= response.data.data
                 setMyHabits(prev => ({
                              ...prev,
                             data: prev.data.map(habit =>
                                      habit._id === habitId
                                            ? {
                                              ...habit,
                                              completed: updatedProgress.completed
                                             }
                                      : habit
                            )
        }))
            }
            catch(err){
                console.log(err.response?.data?.message)
                setServerError(err.response?.data?.message)
            }
            finally{
                setLoading(false)
            }
    }
    return(
        <div>
            <h2> My habits</h2>
            <MemberSidebar/>
            {
                serverError && <p>{serverError}</p>
                
            }
            <input type= "text" value={myHabits.search} onChange= { (e) => {setMyHabits( {...habits, search: e.target.value,page:1})}} placeholder=" Search by title"/>
            <select value= {myHabits.sort} onChange= { (e) => {setMyHabits( {...myHabits, sort:e.target.value, page:1})}}>
                  <option value= "">Select</option>
                  <option value= "createdAt">Created At</option>
                  <option value= "frequency">Frequency</option>
                  <option value= "difficulty">Difficulty</option>
            </select>
            <select value= {myHabits.order} onChange= { (e) => {setMyHabits( {...myHabits, order:e.target.value,page:1})}}>
                <option value="">Select</option>
                <option value= "desc">Descending</option>
                <option value= "asc">Ascending</option>

            </select>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Frequency</th>
                        <th>Difficulty</th>
                        <th>Mark Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        myHabits.data.map( (habit) => {
                            return(
                                <tr>
                                    <td>{habit.title}</td>
                                    <td>{habit.description}</td>
                                    <td>{habit.frequency}</td>
                                    <td>{habit.difficulty}</td>
                                    <td><input type= "checkbox" checked={progress[habit._id] || false} onChange={(e)=>{handleCheck(habit._id)}}/></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button disabled= {myHabits.page===1} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page-1})}}>Previous</button>
            <span> {myHabits.page} of {myHabits.totalPages}</span>
            <button disabled= {myHabits.page===myHabits.totalPages} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page-1})}}>Next</button>
        </div>
    )
}