import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import {useState, useEffect,useContext} from "react"
import AuthContext from "../contexts/AuthContext"
import axios from "../config/axios"
import CoachSidebar from "./CoachSidebar"
import LoadingContext from "../contexts/loadingContext"
export default function CoachDashboard () {

    const {user} = useContext(AuthContext)
    const [coachDashboard, setCoachDashboard] = useState( {
        data: {},
        serverError:""
    })
    const {setLoading} = useContext(LoadingContext)
    useEffect( () => {
        (
            async function fetchDashboard(){
                setLoading(true)
                try{
                    const response= await axios.get("/api/dashboard/coach", {headers: {Authorization: localStorage.getItem("token")}})
                    console.log(response.data)
                    setCoachDashboard( {...coachDashboard, data: response.data})
                }
                catch(err){
                    console.log(err.response?.data?.message)
                    setCoachDashboard( {...coachDashboard, serverError: err.response?.data?.message})
                }
                finally{
                    setLoading(false)
                }
            }

        )()

    }, [])

    if(!user){
       return <p>Loding...</p>
    }
    return( 
        <div>
            <CoachSidebar/>

        <h2>Welcome {user.name} !</h2>
        <ul>
            
            <li>Motivation Quote : </li>
                <li>Quote: {coachDashboard.data.motivationalQuote?.content}</li>
                <li>Author: {coachDashboard.data.motivationalQuote?.author}</li>
            <li> Groups: {coachDashboard.data.totalGroups} </li>
            <li> Members: {coachDashboard.data.totalMembers} </li>
            <li> Habits: {coachDashboard.data.totalHabits}</li>
            <li> DailyProgress: {coachDashboard.data.totalDailyProgress}</li>
            <li> WeeklyProgress: {coachDashboard.data.totalWeeklyProgress}</li>
            <li> MonthlyProgress: {coachDashboard.data.totalMonthlyProgress}</li>
            <li>Daily Chart</li>
            
            <LineChart width={400} height={300} data={coachDashboard.data?.dailyChart}>
                <XAxis dataKey="_id" />
                <YAxis/>
                <Tooltip />
                <Line dataKey="completed" />
            </LineChart>
        </ul>
         
        
        </div>
    )
}