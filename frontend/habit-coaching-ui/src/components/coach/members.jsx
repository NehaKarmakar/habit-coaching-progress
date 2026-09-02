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
        <div>
            <h2>Members List</h2>
            <CoachSidebar/>
            {
                serverError && <p> {serverError}</p>
            }
            <input type= "text" value= {members.search} onChange= { (e) => {setMembers( {...members, search: e.target.value, page:1})}} placeholder="Search by name"/>
            <select value= {members.sort} onChange= { (e) => {setMembers( { ...members, sort: e.target.value, page:1})}}>
               <option value="">Select</option>
               <option value="createdAt">Created At</option>
               <option value="name">Name</option>

            </select>
            <select value= {members.order} onChange= { (e) => {setMembers( {...members, order: e.target.value,page:1})}}>
                <option value= "">Select</option>
                <option value= "asc">Ascending</option>
                <option value= "desc">Descending</option>

            </select>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        members.data.map( (member) =>{
                            return (
                                <tr>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <button onClick= {() => {handleProgressSummary(member._id)}}>Progress Summary</button>
                                    <button onClick= {() => {handleViewGroups(member._id)}}>View Groups</button>
                                    
                                   
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button disabled= {members.page===1} onClick= { () => {setMembers( {...members, page: members.page-1})}}>Previous</button>
            <span>{members.page} of {members.totalPages}</span>
            <button disabled= {members.page===members.totalPages}onClick= { () => {setMembers( {...members, page: members.page+1})}}>Next</button>
        </div>
    )
}