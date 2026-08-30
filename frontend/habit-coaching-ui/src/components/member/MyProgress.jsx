import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import AuthContext from "../../contexts/AuthContext"
import CoachSidebar from "../CoachSidebar"

export default function MyProgress() {
    const [progress, setProgress] = useState( {
        dailyProgress:[],
        weeklyProgress: [],
        monthlyProgress: [],
        currentStreak:"",
        longestStreak:"",
        serverError: ""
    })
    const {user} = useContext(AuthContext)

    useEffect( () => {
        (
           async function fetchProgress() {
            try{
                const response= await axios.get("/api/membersProgress", {headers: {Authorization: localStorage.getItem("token")}})
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
           }
        )()
    },[])
    return(
        <div>
            <h2> My Progress</h2>
          {
            user?.role==="coach" ? <CoachSidebar/> : <MemberSidebar/>
          }
           
            {
                progress.serverError && <p> {progress.serverError}</p>
            }
           
            <h3>Daily Habits Completed</h3>
            <p>Total: {progress.dailyProgress.length}</p>
            {
                progress.dailyProgress.map((ele) => {
                    return (
                        <div>
                        
                        <p> Habit Title: {ele.habit?.title}</p>
                        <p> Completed Date: {new Date(ele.completedDate).toLocaleDateString()}</p>
                        </div>
                    )
                    
                })
            }
             <h3>Weekly Habits Completed</h3>
            <p>Total: {progress.weeklyProgress.length}</p>
            {
                progress.weeklyProgress.map( (ele) => {
                    return(
                        <div>
                       
                        <p> Habit Title: {ele.habit?.title}</p>
                        <p> Completed Date: {new Date(ele.completedDate).toLocaleDateString()}</p>
                        </div>
                    )
                })
            }
                    <h3>Monthly Habits Completed</h3>
                    <p>Total: {progress.monthlyProgress.length}</p>
            {
                progress.monthlyProgress.map( (ele) => {
                    return(
                        <div>
                            
                            <p> Habit Title: {ele.habit?.title}</p>
                            <p> Completed Date: {new Date(ele.completedDate).toLocaleDateString()}</p>
                            </div>
                    )
                })
            }
            <h3>Current Streak : {progress.currentStreak}</h3>
            <h3>Longest Streak: {progress.longestStreak}</h3>
        </div>
    )
}