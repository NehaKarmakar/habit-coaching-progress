import {useState,useEffect,useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import LoadingContext from "../../contexts/loadingContext"
export default function MemberProgress() {
    const [progress, setProgress] = useState( {
        data: [],
        search:"",
        page:1,
        sort:"createdAt",
        order:"desc",
        totalPages:1

    })
    const [serverError, setServerError] = useState("")
    const {setLoading} = useContext(LoadingContext)

    useEffect( () => {
        (
        async function fetchHabitProgress(){
            setLoading(true)
            try{
                const response= await axios.get("/api/progress/aggregate" ,{
                    params: {
                        search: progress.search,
                        page: progress.page,
                        limit:5,
                        sort: progress.sort,
                        order: progress.order
                    },
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                console.log(response.data.data)
                setProgress( {...progress, data: response.data.data, totalPages:response.data.totalPages})


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

    },[progress.search, progress.page, progress.sort, progress.order])
    return (
        <div>
            <CoachSidebar/>
            
            <h2> Member Progress</h2>
            {serverError && <p>{serverError}</p>}
             <input type= "text" value= {progress.search} onChange= { (e) => {setProgress({...progress, search: e.target.value, page:1})}} placeholder="Search by member name or habit title"/>
             <select value= {progress.sort} onChange= { (e) => {setProgress( {...progress, sort: e.target.value, page:1})}}>
                <option value= "">Select</option>
                <option value= "completedDate">Completed Date</option>
             </select>
             <select value= {progress.order} onChange= { (e) => {setProgress({...progress, order:e.target.value, page:1})}}>
                <option value="">Select</option>
                <option value="desc">Descending</option>
                <option value= "asc">Acending</option>
             </select>
            <table>
                <thead>
                    <tr>
                        <th> User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Habit Title</th>
                        <th>Completed</th>
                        <th>Completed Date</th>
                    </tr>
                    
                </thead>
                <tbody>
                        
                            {
                                progress.data.map( (item) => {
                                    return (
                                        <tr>
                                        <td>{item.memberDetails?.[0]?.name}</td>
                                        <td>{item.memberDetails?.[0]?.email}</td>
                                        <td>{item.memberDetails?.[0]?.phone}</td>
                                        <td>{item.habitDetails?.[0]?.title}</td>
                                        <td>{item.completed ? "Yes" : "No"}</td>
                                        <td>
                    {item.completed && item.completedDate
                        ? new Date(item.completedDate).toLocaleDateString()
                        : "-"
                    }
                </td>
                                        

                                        
                                      </tr>
                                    )
                                })
                            }
                        
                    </tbody>
            </table>
            <button disabled= {progress.page===1} onClick= { () => setProgress( {...progress, page: progress.page-1})}>previous</button>
            <span> {progress.page} of {progress.totalPages}</span>
            <button disabled= {progress.page===progress.totalPages} onClick= { () => setProgress( {...progress, page: progress.page+1})}>next</button>
        </div>
    )
}