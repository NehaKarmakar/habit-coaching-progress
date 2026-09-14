import { LineChart, Line, XAxis,YAxis,Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "../components/ui/chart"
import {useState, useEffect,useContext} from "react"
import axios from "../config/axios"
import AuthContext from "../contexts/AuthContext"
import MemberSidebar from "./memberSidebar"
import LoadingContext from "../contexts/loadingContext"
export default  function MemberDashboard() {
    const {user} = useContext(AuthContext)
    const [memberDashboard, setMemberDashboard] = useState({
        data: {},
        serverError: ""
    })
    const {setLoading} = useContext(LoadingContext)
    const chartConfig = {
    completed: {
        label: "Completed",
    },
}

const dailyChart = memberDashboard.data?.dailyChart?.length
    ? memberDashboard.data.dailyChart
    : [
        { _id: "Mon", completed: 0 },
        { _id: "Tue", completed: 0 },
        { _id: "Wed", completed: 0 },
        { _id: "Thu", completed: 0 },
        { _id: "Fri", completed: 0 },
        { _id: "Sat", completed: 0 },
        { _id: "Sun", completed: 0 },
    ]
    useEffect( () => {
        (
            async function fetchDashboard() {
                console.log("component loaded")
                setLoading(true)
                try{
                  const response= await axios.get("/api/dashboard/member", { headers : {Authorization: localStorage.getItem("token")}})
                  console.log(response.data)
                  setMemberDashboard( {...memberDashboard, data: response.data})
                }
                catch(err){
                    console.log(err.response.message)
                }
                finally{
                    setLoading(false)
                }
            }

        )()

    }, [])
    if(!user){
        return <p>Loading...</p>
    }
    return(
        <div className="flex min-h-screen gap-8">
            <MemberSidebar/>
            <div className="flex-1 p-6">
            <h2  className="font-semibold text-center">Welcome {user.name} !</h2> <br/>
             
              {
                memberDashboard.serverError && <p className="text-xl font-semibold text-red-700"> {memberDashboard.serverError}</p>
            }<br/>
                <div className="hover:scale-95 border-xl shadow-md bg-blue-950 text-white p-4 m-2">
                <h3 className="text-center font-semibold ">
                    Quote: {memberDashboard.data.motivationalQuote?.content}
                    - {memberDashboard.data.motivationalQuote?.author}
                </h3>
                </div>

                <div className="grid grid-cols-4 gap-6 mt-6 max-w-4xl mx-auto">

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Groups Assigned: {memberDashboard.data.assignedGroups?.length}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold ">Habits Assigned: {memberDashboard.data.assignedHabits?.length}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Daily Progress: {memberDashboard.data.totalDailyProgress}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Weekly Progress: {memberDashboard.data.totalWeeklyProgress}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Monthly Progress: {memberDashboard.data.totalMonthlyProgress}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Current Streak: {memberDashboard.data.memberCurrentStreak}</h3>
                </div>

                <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
                <h3 className="text-center font-semibold "> Longest Streak: {memberDashboard.data.memberLongestStreak}</h3>
                </div>
                </div>
                <br/><br/>
                <h3 className="font-semibold text-center">Daily Progress Chart</h3> <br/>
            <div className="flex justify-center gap-4">

                 <ChartContainer
                  config={chartConfig}
                  className="w-[400px] h-[300px] bg-blue-100 border rounded-lg p-6 hover:bg-fuchsia-200 scale-95 shadow-md" >
                  <LineChart data={dailyChart}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="currentColor"
                    strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>

           </div>

            <div className="hover:scale-95 border-xl shadow-md bg-amber-700 text-white p-4 m-2">
            <h3 className="font-semibold text-center">Ai Advice: {memberDashboard.data.advice} </h3>
          </div>  
          </div>
        </div>
    )
}