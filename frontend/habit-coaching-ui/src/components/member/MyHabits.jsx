import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import LoadingContext from "../../contexts/loadingContext"
import AuthContext from "../../contexts/AuthContext"
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
    const {user} = useContext(AuthContext)
    const {setLoading} = useContext(LoadingContext)
    const today= new Date().toLocaleDateString()
    const progressKey= user ?`progress_${user._id}`: null
    const savedProgress= JSON.parse(localStorage.getItem(progressKey)) || {}
    const [progress, setProgress] = useState( 
        savedProgress.date===today? savedProgress.data : {}
    )
    
    
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

    useEffect(() => {
    if (user) {
        const progressKey = `progress_${user._id}`
        const savedProgress = JSON.parse(localStorage.getItem(progressKey)) || {}

        if (savedProgress.date === today) {
            setProgress(savedProgress.data)
        }
    }
}, [user])

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
        localStorage.setItem(progressKey, 
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

    if (!user) {
    return <p>Loading...</p>
}
    return(
        <div className="flex min-h-screen gap-8">
            
            <MemberSidebar/>
            <div className="flex-1 p-6 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center"> My habits</h2>
            {
                serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700">{serverError}</p>
                
            }<br/>
            <input type= "text" value={myHabits.search} onChange= { (e) => {setMyHabits( {...myHabits, search: e.target.value,page:1})}} placeholder=" Search by title"/>
            <br/>

             <label className=" font-semibold m-3 p-4 max-sm:block">Sort By: 
            <select value= {myHabits.sort} onChange= { (e) => {setMyHabits( {...myHabits, sort:e.target.value, page:1})}}>
                
                  <option value= "createdAt">Created At</option>
                  <option value= "frequency">Frequency</option>
                  
            </select>
            </label>

             <label className="font-semibold m-3 p-4 max-sm:block">Order:
            <select value= {myHabits.order} onChange= { (e) => {setMyHabits( {...myHabits, order:e.target.value,page:1})}}>
               
                <option value= "desc">Descending</option>
                <option value= "asc">Ascending</option>

            </select>
            </label>
            <br/><br/>
            
            {myHabits.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No habits found for this group.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
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
                                <tr key= {habit._id}>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.title || "No longer habit exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.description || "No longer habit exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.frequency || "No longer habit exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{habit.difficulty || "No longer habit exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110"><input type= "checkbox" checked={progress[habit._id] || false} onChange={(e)=>{handleCheck(habit._id)}}/></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            </div>
            <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {myHabits.page===1} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page-1})}}>Previous</button>
            <span> {myHabits.page} of {myHabits.totalPages}</span>
            <button disabled= {myHabits.page===myHabits.totalPages} onClick= {() => {setMyHabits( {...myHabits, page: myHabits.page+1})}}>Next</button>
        </div>
        </div>
        </div>
    )
}