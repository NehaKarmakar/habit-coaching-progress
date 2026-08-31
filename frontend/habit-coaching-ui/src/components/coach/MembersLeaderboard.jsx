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
        <div>
            <h2>  Leaderboard</h2>
            {
            user?.role==="coach" ?  <CoachSidebar/> : <MemberSidebar/>
            }
           
            {
                serverError && <p> {serverError}</p>
            }
            <input type="text" value= {leaderboard.search} onChange= { (e) => { setLeaderboard( {...leaderboard, search: e.target.value, page:1})}} placeholder="Search by member name" />
            <select value= {leaderboard.sort} onChange= { (e) => {setLeaderboard( {...leaderboard, sort: e.target.value, page:1}) }}>
              <option value= "">Select</option>
              <option value= "name">Name</option>
              <option value= "completedHabit">Completed Habits</option>
            </select>
            <select value= {leaderboard.order} onChange= { (e) => {setLeaderboard( {...leaderboard, order: e.target.value, page:1})}}>
                  <option value= "">Select</option>
                  <option value= "desc"> Descending</option>
                  <option value= "asc">Ascending</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Completed Habits</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        leaderboard.data.map( (ele) => {
                            return(
                                
                                    <tr>
                                        <td>{ele.rank}</td>
                                        <td>{ele.name}</td>
                                        <td>{ele.email}</td>
                                        <td>{ele.completedHabit}</td>
                                    </tr>
                                
                            )
                        })
                    }
                </tbody>
            </table>
            <button disabled= {leaderboard.page===1} onClick= {() => {setLeaderboard( {...leaderboard, page: leaderboard.page-1})}}>Previous</button>
            <span> {leaderboard.page} of {leaderboard.totalPages}</span>
            <button disabled= {leaderboard.page===leaderboard.totalPages} onClick= {() => {setLeaderboard( {...leaderboard, page: leaderboard.page+1})}}>Next</button>
        </div>
    )
}