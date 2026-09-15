import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import MemberSidebar from "../memberSidebar"
import AuthContext from "../../contexts/AuthContext"
import LoadingContext from "../../contexts/loadingContext"
export default function MembersLeaderboard() {
    const [leaderboard, setLeaderboard] = useState( {
        data:[],
        search:"",
        page:1,
        sort:"completedHabit",
        order: "desc",
        totalPages:1
    })
    const [serverError , setServerError] = useState("")
    const {setLoading} = useContext(LoadingContext)
    const {user} = useContext(AuthContext)
    useEffect( () => {
        (
            async function fetchLeaderboard() {
                setLoading(true)
                try{
                    const response= await axios.get("/api/leaderboard/leaderboardAggregate" ,{
                        params: {
                            search: leaderboard.search,
                            page: leaderboard.page,
                            limit:5,
                            sort:leaderboard.sort,
                            order:leaderboard.order
                        },
                        headers: {Authorization: localStorage.getItem("token")}
                    })
                    console.log(response.data)
                    setLeaderboard( {...leaderboard, data: response.data.data, totalPages: response.data.totalPages})

                }
                catch(err){
                    console.log("error",err.response?.data?.message)
                    setServerError(err.response?.data?.message)
                }
                finally{
                    setLoading(false)
                }
            }
        )()

    },[leaderboard.search, leaderboard.page, leaderboard.sort, leaderboard.order])
    return(
        <div className="flex min-h-screen gap-8">
            
            {
            user?.role==="coach" ?  <CoachSidebar/> : <MemberSidebar/>
            }
             <div className="flex-1 max-sm:min-w-0 p-6 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center">  Leaderboard</h2>
           
            {
                serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {serverError}</p>
            }
            <br/>

            <input className="max-sm:w-full" type="text" value= {leaderboard.search} onChange= { (e) => { setLeaderboard( {...leaderboard, search: e.target.value, page:1})}} placeholder="Search by member username" /><br/>

            <label className=" font-semibold m-3 p-4  max-sm:block">Sort By: 
            <select value= {leaderboard.sort} onChange= { (e) => {setLeaderboard( {...leaderboard, sort: e.target.value, page:1}) }}>
            
              <option value= "name">Name</option>
              <option value= "completedHabit">Completed Habits</option>
            </select>
            </label>

             <label className="font-semibold m-3 p-4  max-sm:block">Order:
            <select value= {leaderboard.order} onChange= { (e) => {setLeaderboard( {...leaderboard, order: e.target.value, page:1})}}>
                 
                  <option value= "desc"> Descending</option>
                  <option value= "asc">Ascending</option>
            </select>
            </label>
            
            <br/><br/>
            {leaderboard.data.length === 0 && 
                    <p className="text-xl  max-sm:text-base font-semibold text-center text-red-700">
                         No members found.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Rank</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Username</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Email</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed Habits</th>
                    </tr>
                </thead>
                <tbody className="text-black ">
                    {
                        leaderboard.data.map( (ele) => {
                            return(
                                
                                    <tr key= {ele._id}>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele?.rank || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele?.name || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele?.email || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{ele?.completedHabit}</td>
                                    </tr>
                                
                            )
                        })
                    }
                </tbody>
            </table>
            </div>
             <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {leaderboard.page===1} onClick= {() => {setLeaderboard( {...leaderboard, page: leaderboard.page-1})}}>Previous</button>
            <span> {leaderboard.page} of {leaderboard.totalPages}</span>
            <button disabled= {leaderboard.page===leaderboard.totalPages} onClick= {() => {setLeaderboard( {...leaderboard, page: leaderboard.page+1})}}>Next</button>
        </div>
        </div>
        </div>
    )
}