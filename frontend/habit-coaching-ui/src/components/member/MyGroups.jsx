import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import { Link,useNavigate } from "react-router-dom"
import LoadingContext from "../../contexts/loadingContext"
export default function MyGroups(){
    const [myGroups, setMyGroups] = useState( {
        data:[],
        search:"",
        page:1,
        sort:"createdAt",
        order: "desc",
        totalPages:1
        
    })
    const [serverError, setServerError] = useState("")
    const {setLoading} = useContext(LoadingContext)
    const navigate= useNavigate()
    useEffect( () => {
        (
            async function fetchMyGroups(){
                setLoading(true)
               try{
                const response= await axios.get("/api/memberGroupsAggregate", {
                    params: {
                        search: myGroups.search,
                        page:myGroups.page,
                        limit:5,
                        sort:myGroups.sort,
                        order:myGroups.order
                    },
                    headers: {Authorization: localStorage.getItem("token")}

                })
                console.log(response.data)
                setMyGroups( {...myGroups, data:response.data.data, totalPages: response.data.totalPages})

               }
               catch(err){
                console.log(err.response?.data?.message)
                setServerError(err.response?.data?.message)

               }
               finally{
                setLoading(false)
               }
            }
        )()
    },[myGroups.search, myGroups.page, myGroups.sort, myGroups.order])
    return(
        <div className="flex min-h-screen gap-8">
         
            <MemberSidebar/>
            <div className="flex-1 p-6 max-sm:p-3">
                <h2 className="text-2xl font-semibold text-center"> My Groups</h2>
            {
                serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {serverError}</p>
                
            } <br/>

            <input type="text" name= "search" value= {myGroups.search} onChange= { (e) => { setMyGroups( {...myGroups, search: e.target.value, page:1})}} placeholder="Search by group name"/><br/>

             <label className=" font-semibold m-3 p-4 max-sm:block">Sort By: 
            <select value= {myGroups.sort} onChange= { (e) => { setMyGroups( {...myGroups, sort: e.target.value, page:1})}}>
                
                <option value= "joinedAt">Joined At</option>
                <option value= "groupName">Group Name</option>

            </select>
            </label>

            <label className="font-semibold m-3 p-4 max-sm:block">Order:
            <select value= {myGroups.order} onChange= { (e) => {setMyGroups( {...myGroups, order:e.target.value, page:1})}}>
               
                <option value= "asc">Ascending</option>
                <option value= "desc">Descending</option>

            </select>
            </label>
             
             <br/> <br/>

             {myGroups.data.length === 0 && 
                    <p className="text-xl max-sm:text-base font-semibold text-center text-red-700">
                         No groups found.
                    </p>
                
               }<br/>
               <div className="overflow-x-auto">
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Group Name</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Joined At</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-black "> 
                    {
                        myGroups.data.map( (group) => {
                            return(
                                <tr key= {group._id}>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{group.groupDetails?.[0]?.groupName || "No longer group exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{group.groupDetails?.[0]?.description || "No longer group exists"}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{new Date(group.joinedAt).toLocaleDateString()}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:scale-110"><button onClick= { () => {navigate(`/coach/habits/${group.groupDetails?.[0]?._id}`)}}>View Habits</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            </div>

            <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {myGroups.page===1} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page-1})}}>Previou</button>
            <span>{myGroups.page} of {myGroups.totalPages}</span>
            <button disabled= {myGroups.page===myGroups.totalPages} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page+1})}} >Next</button>
        </div>
        </div>
        </div>
    )
}