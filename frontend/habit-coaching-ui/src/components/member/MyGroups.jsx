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
        <div>
         
            <MemberSidebar/>
            {
                serverError && <p> {serverError}</p>
                
            } <h2> My Groups</h2>
            <input type="text" name= "search" value= {myGroups.search} onChange= { (e) => { setMyGroups( {...myGroups, search: e.target.value, page:1})}} placeholder="Search by group name"/>
            <select value= {myGroups.sort} onChange= { (e) => { setMyGroups( {...myGroups, sort: e.target.value, page:1})}}>
                <option value= "">Select</option>
                <option value= "joinedAt">Joined At</option>
                <option value= "groupName">Group Name</option>

            </select>
            <select value= {myGroups.order} onChange= { (e) => {setMyGroups( {...myGroups, order:e.target.value, page:1})}}>
                <option value= "">Select</option>
                <option value= "asc">Ascending</option>
                <option value= "desc">Descending</option>

            </select>
            <table>
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Description</th>
                        <th>Joined At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        myGroups.data.map( (group) => {
                            return(
                                <tr>
                                    <td>{group.groupDetails?.[0]?.groupName}</td>
                                    <td>{group.groupDetails?.[0]?.description}</td>
                                    <td>{new Date(group.joinedAt).toLocaleDateString()}</td>
                                    <td><button onClick= { () => {navigate(`/coach/habits/${group.groupDetails?.[0]?._id}`)}}>View Habits</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

           
            <button disabled= {myGroups.page===1} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page-1})}}>Previou</button>
            <span>{myGroups.page} of {myGroups.totalPages}</span>
            <button disabled= {myGroups.page===myGroups.totalPages} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page+1})}} >Next</button>
        </div>
    )
}