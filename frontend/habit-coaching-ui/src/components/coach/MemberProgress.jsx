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
        <div className="flex min-h-screen gap-8">
            <CoachSidebar/>
            <div className="flex-1 p-6 max-sm:p-3">
            <h2 className="text-2xl font-semibold text-center"> Member Progress</h2>
            {serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700">{serverError}</p>}<br/>

             <input type= "text" value= {progress.search} onChange= { (e) => {setProgress({...progress, search: e.target.value, page:1})}} placeholder="Search by member username or habit title"/><br/>

             <label className=" font-semibold m-3 p-4 max-sm:block">Sort By: 
             <select value= {progress.sort} onChange= { (e) => {setProgress( {...progress, sort: e.target.value, page:1})}}>
                
                <option value= "completedDate">Completed Date</option>
             </select>
             </label>
            
            <label className="font-semibold m-3 p-4 max-sm:block">Order:
             <select value= {progress.order} onChange= { (e) => {setProgress({...progress, order:e.target.value, page:1})}}>
                
                <option value="desc">Descending</option>
                <option value= "asc">Ascending</option>
             </select>
             </label>
             <br/><br/>

             {progress.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No members found.
                    </p>
                
               }<br/>
            <div className="overflow-x-auto">
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md"> Username</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Email</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Phone No.</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Habit Title</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Completed Date</th>
                    </tr>
                    
                </thead>
                <tbody>
                        
                            {
                                progress.data.map( (item) => {
                                    return (
                                        <tr key={item._id}>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{item.memberDetails?.[0]?.name  || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{item.memberDetails?.[0]?.email || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{item.memberDetails?.[0]?.phone || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{item.habitDetails?.[0]?.title || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{item.completed ? "Yes" : "No" || "No longer member exists"}</td>
                                        <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">
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
            </div>
            <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {progress.page===1} onClick= { () => setProgress( {...progress, page: progress.page-1})}>Previous</button>
            <span> {progress.page} of {progress.totalPages}</span>
            <button disabled= {progress.page===progress.totalPages} onClick= { () => setProgress( {...progress, page: progress.page+1})}>Next</button>
        </div>
        </div>
        </div>
    )
}