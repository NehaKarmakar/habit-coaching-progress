import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import AuthContext from "../../contexts/AuthContext"
import CoachSidebar from "../CoachSidebar"
import { useParams } from "react-router-dom"
import LoadingContext from "../../contexts/loadingContext"
export default function ProgressSummary() {
    const [progress, setProgress] = useState( {
        dailyProgress:[],
        weeklyProgress: [],
        monthlyProgress: [],
        currentStreak:"",
        longestStreak:"",
        serverError: ""
    })
    const {user} = useContext(AuthContext)
    const {setLoading} = useContext(LoadingContext)
  const {id} = useParams()
    useEffect( () => {
        (
           async function fetchProgress() {
            setLoading(true)
            try{
                const response= await axios.get(`/api/membersProgress/${id}`, {headers: {Authorization: localStorage.getItem("token")}})
                console.log(response.data)
                setProgress( {...progress, 
                    dailyProgress: response.data.dailyProgress, 
                    weeklyProgress: response.data.weeklyProgress, 
                    monthlyProgress: response.data.monthlyProgress,
                    currentStreak: response.data.current_streak,
                    longestStreak: response.data.longest_streak
                 })

            }
            catch(err){
                console.log(err.response.data)
                setProgress( {...progress, serverError: err.response.data.message})
            }
            finally{
                setLoading(false)
            }
           }
        )()
    },[])
    
        return(
                <div className="flex min-h-screen gap-8">
                    
                  {
                    user?.role==="coach" ? <CoachSidebar/> : <MemberSidebar/>
                  }
                    <div className="flex-1 p-6">
                  <h2 className="text-2xl font-semibold text-center"> My Progress</h2>
                   
                    {
                        progress.serverError && <p className="text-xl font-semibold text-red-700"> {progress.serverError}</p>
                    }
                   
                   <div className="grid grid-cols-2 gap-8 mt-6 max-w-4xl mx-auto">
                 
        
                    <div className="card border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                    <h3 className="font-semibold text-center">Daily Habits </h3>
                    <p className=" font-semibold">Total: {progress.dailyProgress?.length}</p><br/>
                    <table className="border-collapse border">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Habit Title</th>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-black ">
                            {
                                progress.dailyProgress.map( (ele) => {
                                    return(
                                        <tr>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele.habit?.title || "No longer habit exists"}</td>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{new Date(ele?.completedDate).toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                   
                   
                    <div className="card border rounded-lg p-6  hover:bg-fuchsia-200 scale-95 shadow-md">
                     <h3 className=" font-semibold text-center">Weekly Habits </h3>
                     <p  className=" font-semibold">Total: {progress.weeklyProgress.length}</p><br/>
                    <table className="border-collapse border">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Habit Title</th>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-black ">
                            {
                                progress.weeklyProgress.map( (ele) => {
                                    return(
                                        <tr>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele.habit?.title || "No longer habit exists"}</td>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{new Date(ele?.completedDate).toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                    
        
                    <div className="card border rounded-lg p-6  hover:bg-fuchsia-200 scale-95 shadow-md">
                            <h3 className=" font-semibold text-center">Monthly Habits </h3>
                            <p  className=" font-semibold">Total: {progress?.monthlyProgress?.length}</p><br/>
                    <table className="border-collapse border">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Habit Title</th>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-black ">
                            {
                                progress.monthlyProgress.map( (ele) => {
                                    return(
                                        <tr>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele.habit?.title || "No longer habit exists"}</td>
                                            <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{new Date(ele?.completedDate).toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                    
        
                    <div className="card border rounded-lg p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                       <h3 className=" font-semibold text-center">Streaks</h3>
                    <table  className="border-collapse border">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Current Streak</th>
                                <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Longest Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{progress?.currentStreak}</td>
                                <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{progress?.longestStreak}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    
                </div>
                </div>
                </div>
            )
    
}