import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import AuthContext from "../../contexts/AuthContext"
import CoachSidebar from "../CoachSidebar"
import LoadingContext from "../../contexts/loadingContext"
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
    const {setLoading} = useContext(LoadingContext)
    useEffect( () => {
        (
           async function fetchProgress() {
            setLoading(true)
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
            finally{
                setLoading(false)
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
           
           
            <h3>Daily Habits </h3>
            <p>Total: {progress.dailyProgress.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Habit Title</th>
                        <th>Completed Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        progress.dailyProgress.map( (ele) => {
                            return(
                                <tr>
                                    <td>{ele.habit?.title}</td>
                                    <td>{new Date(ele.completedDate).toLocaleDateString()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <br/><br/>
           
             <h3>Weekly Habits </h3>
             <p>Total: {progress.weeklyProgress.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Habit Title</th>
                        <th>Completed Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        progress.weeklyProgress.map( (ele) => {
                            return(
                                <tr>
                                    <td>{ele.habit?.title}</td>
                                    <td>{new Date(ele.completedDate).toLocaleDateString()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <br/><br/>
                    <h3>Monthly Habits </h3>
                    <p>Total: {progress.monthlyProgress.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Habit Title</th>
                        <th>Completed Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        progress.monthlyProgress.map( (ele) => {
                            return(
                                <tr>
                                    <td>{ele.habit?.title}</td>
                                    <td>{new Date(ele.completedDate).toLocaleDateString()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <br/><br/>
               <h3>Streaks</h3>
            <table>
                <thead>
                    <tr>
                        <th>Current Streak</th>
                        <th>Longest Streak</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{progress.currentStreak}</td>
                        <td>{progress.longestStreak}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    )
}