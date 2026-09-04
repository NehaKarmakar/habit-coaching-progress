import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import CoachSidebar from "../CoachSidebar"
import { useNavigate ,Link} from "react-router-dom"
import LoadingContext from "../../contexts/loadingContext"
export default function Members () {
    const [members, setMembers] = useState( {
        data: [],
        search: "",
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
               async function fetchMembers() {
                setLoading(true)
                try{
                    const response= await axios.get("/api/members", {
                        params: {
                            search: members.search,
                            page: members.page,
                            sort:members.sort,
                            order:members.order,
                            limit:5
                        },
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    })
                    console.log(response.data)
                    setMembers( {...members, data: response.data.data, totalPages: response.data.totalPages})

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

    },[members.search, members.page, members.sort, members.order])

    const handleProgressSummary = (id) => {
            navigate(`/coach/member/progress/summary/${id}`)
            //<Link to="/coach/member/progress/summary/${id}" >View Progress</Link>
    }
    const handleViewGroups = (id) => {
            navigate(`/coach/member/groups/${id}`)
            //<Link to="/coach/member/progress/summary/${id}" >View Progress</Link>
    }
            
    return (
        <div className="flex min-h-screen gap-8">
           
            <CoachSidebar/>
            <div className="flex-1 p-6">
              <h2 className="text-2xl font-semibold text-center">Members List</h2>
            {
                serverError && <p className="text-xl font-semibold text-red-700"> {serverError}</p> 
            } <br/>

            <input type= "text" value= {members.search} onChange= { (e) => {setMembers( {...members, search: e.target.value, page:1})}} placeholder="Search by name"/>
            <br/>

            <label className=" font-semibold m-3 p-4">Sort By: 
            <select value= {members.sort} onChange= { (e) => {setMembers( { ...members, sort: e.target.value, page:1})}}>
               <option value="">Select</option>
               <option value="createdAt">Created At</option>
               <option value="name">Name</option>

            </select>
            </label>

             <label className="font-semibold m-3 p-4">Order:
            <select value= {members.order} onChange= { (e) => {setMembers( {...members, order: e.target.value,page:1})}}>
                <option value= "">Select</option>
                <option value= "asc">Ascending</option>
                <option value= "desc">Descending</option>

            </select>
        </label>
        <br/> <br/>
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Username</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Email</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Phone No.</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Actions</th>
                        
                    </tr>
                </thead>
                <tbody className="text-black ">
                    {
                        members.data.map( (member) =>{
                            return (
                                <tr>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{member.name}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{member.email}</td>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{member.phone}</td>
                                    <td className="border border-black px-6 py-3  text-center hover:scale-110">
                                    <button onClick= {() => {handleProgressSummary(member._id)} } className="m-2">Progress Summary</button>
                                    <button onClick= {() => {handleViewGroups(member._id)}}>View Groups</button>
                                    </td>
                                   
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

             <div className="flex justify-center items-center gap-10 mt-10">
            <button disabled= {members.page===1} onClick= { () => {setMembers( {...members, page: members.page-1})}}>Previous</button>
            <span>{members.page} of {members.totalPages}</span>
            <button disabled= {members.page===members.totalPages}onClick= { () => {setMembers( {...members, page: members.page+1})}}>Next</button>
        </div>
        </div>
        </div>
        
    )
}