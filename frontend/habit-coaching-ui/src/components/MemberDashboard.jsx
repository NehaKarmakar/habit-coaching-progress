import { LineChart, Line, XAxis,YAxis,Tooltip } from "recharts"
import {useState, useEffect,useContext} from "react"
import axios from "../config/axios"
import AuthContext from "../contexts/AuthContext"
import MemberSidebar from "./memberSidebar"
export default  function MemberDashboard() {
    const {user} = useContext(AuthContext)
    const [memberDashboard, setMemberDashboard] = useState({
        data: {},
        serverError: ""
    })

    useEffect( () => {
        (
            async function fetchDashboard() {
                console.log("component loaded")
                try{
                  const response= await axios.get("/api/dashboard/member", { headers : {Authorization: localStorage.getItem("token")}})
                  console.log(response.data)
                  setMemberDashboard( {...memberDashboard, data: response.data})
                }
                catch(err){
                    console.log(err.response.message)
                }
            }

        )()

    }, [])
    if(!user){
        return <p>Loading...</p>
    }
    return(
        <div>
            <MemberSidebar/>
            <h2>Welcome {user.name} !</h2>
            <ul>
                <li> Motivational Quote</li>
                <ul>
                    <li>Quote: {memberDashboard.data.motivationalQuote?.content}</li>
                    <li>Author: {memberDashboard.data.motivationalQuote?.author}</li>
                </ul>
                <li> GroupsAssigned: {memberDashboard.data.assignedGroups?.length}</li>
                <li> AssignedHabits: {memberDashboard.data.assignedHabits?.length}</li>
                <li> DailyHabits: {memberDashboard.data.totalDailyProgress}</li>
                <li> WeeklyProgress: {memberDashboard.data.totalWeeklyProgress}</li>
                <li> MonthlyProgress: {memberDashboard.data.totalMonthlyProgress}</li>
                <li> CurrentStreak: {memberDashboard.data.memberCurrentStreak}</li>
                <li> LongestStreak: {memberDashboard.data.memberLongestStreak}</li>
                <li> Daily Chart</li>
                <LineChart width={400} height={300} data={memberDashboard.data?.dailyChart}>
                  <XAxis dataKey="_id" />
                  <YAxis/>
                  <Tooltip />
                  <Line dataKey="completed" />
                </LineChart>
            </ul>
            <p>Advice: {memberDashboard.data.advice} </p>
            
        </div>
    )
}