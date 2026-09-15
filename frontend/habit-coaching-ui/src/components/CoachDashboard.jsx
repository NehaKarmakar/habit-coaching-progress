import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "../components/ui/chart"
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
    const chartConfig = {
    completed: {
        label: "Completed",
    },
}

const dailyChart = coachDashboard.data?.dailyChart?.length
    ? coachDashboard.data.dailyChart
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
        <div className="flex min-h-screen gap-8">
            <CoachSidebar/>
        <div className="flex-1 p-6">
        <h2 className="font-semibold text-center">Welcome {user.name} !</h2> <br/>
         {
                coachDashboard.serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {coachDashboard.serverError}</p>
            }<br/>

             <div className="hover:scale-95 border-xl shadow-md bg-blue-950 text-white p-4 m-2">
               <h3 className="text-center font-semibold "> Quote: {coachDashboard.data.motivationalQuote?.content}  -
                 {coachDashboard.data.motivationalQuote?.author}</h3>
                 </div>
            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-6 mt-6 max-w-4xl mx-auto">
        
            

            <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> Groups :  {coachDashboard.data.totalGroups} </h3>
            </div>

            <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> Members:  {coachDashboard.data.totalMembers} </h3>
            </div>

            <div className="card  bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> Habits:  {coachDashboard.data.totalHabits}</h3>
            </div>

            <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> DailyProgress:  {coachDashboard.data.totalDailyProgress}</h3>
            </div>

            <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> WeeklyProgress:  {coachDashboard.data.totalWeeklyProgress}</h3>
            </div>

            <div className="card bg-blue-100 border rounded-lg  p-6   hover:bg-fuchsia-200 scale-95 shadow-md">
            <h3 className="font-semibold text-center"> MonthlyProgress:  {coachDashboard.data.totalMonthlyProgress}</h3>
            </div>
            </div> <br/>
             <h3 className="font-semibold text-center">Daily Competed Chart</h3>
         <div className="flex justify-center gap-4">
            
        <ChartContainer
        config={chartConfig}
        className="w-[400px] max-sm:w-full h-[300px] bg-blue-100 border rounded-lg p-6 hover:bg-fuchsia-200 scale-95 shadow-md">
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
        </div>
        </div>
    )
}