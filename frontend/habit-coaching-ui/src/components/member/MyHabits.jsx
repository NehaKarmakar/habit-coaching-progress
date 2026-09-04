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
    const today= new Date().toLocaleDateString()
    const savedProgress= JSON.parse(localStorage.getItem("progress")) || {}
    const [progress, setProgress] = useState( 
        savedProgress.date===today? savedProgress.data : {}
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
        
       
        markComplete(habitId)
    }

    const markComplete= async(habitId) => {
        setLoading(true)
            try{
                const response= await axios.post("/api/progress" , {habit: habitId} , {headers: {Authorization:localStorage.getItem("token")}})
                console.log(response.data)
                const updatedProgress= response.data.data
                 
                
                const newProgress= {
            ...progress,
            [habitId]: updatedProgress.completed
        }
        setProgress(newProgress)
        localStorage.setItem("progress", 
            JSON.stringify({date: new Date().toLocaleDateString(),data:newProgress}))
       
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
        <div className="flex min-h-screen gap-8">
            
            <MemberSidebar/>
            <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold text-center"> My habits</h2>
            {
                serverError && <p className="text-xl font-semibold text-red-700">{serverError}</p>
                
            }<br/>
            <input type= "text" value={myHabits.search} onChange= { (e) => {setMyHabits( {...myHabits, search: e.target.value,page:1})}} placeholder=" Search by title"/>
            <br/>

             <label className=" font-semibold m-3 p-4">Sort By: 
            <select value= {myHabits.sort} onChange= { (e) => {setMyHabits( {...myHabits, sort:e.target.value, page:1})}}>
                  <option value= "">Select</option>
                  <option value= "createdAt">Created At</option>
                  <option value= "frequency">Frequency</option>
                  <option value= "difficulty">Difficulty</option>
            </select>
            </label>

             <label className="font-semibold m-3 p-4">Order:
            <select value= {myHabits.order} onChange= { (e) => {setMyHabits( {...myHabits, order:e.target.value,page:1})}}>
                <option value="">Select</option>
                <option value= "desc">Descending</option>
                <option value= "asc">Ascending</option>

            </select>
            </label>
            <br/><br/>

            <table className=" w-full border-collapse border">
                <thead  className="bg-blue-500 text-white">
                    <tr>
                        <th  className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Title</th>
                        <th  className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                        <th  className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Frequency</th>
                        <th  className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Difficulty</th>
                        <th  className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Mark Complete</th>
                    </tr>
                </thead>
                <tbody className="text-black ">
                    {
                        myHabits.data.map( (habit) => {
                            return(
                                <tr>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.title}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.description}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.frequency}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.difficulty}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110"><input type= "checkbox" checked={progress[habit._id] || false} onChange={(e)=>{handleCheck(habit._id)}}/></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {myHabits.page===1} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page-1})}}>Previous</button>
            <span> {myHabits.page} of {myHabits.totalPages}</span>
            <button disabled= {myHabits.page===myHabits.totalPages} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page+1})}}>Next</button>
        </div>
        </div>
        </div>
    )
}