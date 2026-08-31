import {useState, useEffect,useContext} from "react"
import axios from "../../config/axios"
import MemberSidebar from "../memberSidebar"
import { Link } from "react-router-dom"
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
            <h2> My Groups</h2>
            <MemberSidebar/>
            {
                serverError && <p> {serverError}</p>
                
            }
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

           <ul> { 
                myGroups.data.map( (group) => {
                      return (
                        <div>
                            <li>Group Name: {group.groupDetails?.[0]?.groupName}</li>
                            <li>Description: {group.groupDetails?.[0]?.description}</li>
                            <li>Joined At: {new Date(group.joinedAt).toLocaleDateString()}</li>
                            <Link to={`/coach/habits/${group.groupDetails?.[0]?._id}`} >View Habits</Link>
                        </div>
                      )
                })
            }
            </ul>
            <button disabled= {myGroups.page===1} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page-1})}}>Previou</button>
            <span>{myGroups.page} of {myGroups.totalPages}</span>
            <button disabled= {myGroups.page===myGroups.totalPages} onClick={ () => {setMyGroups( {...myGroups, page: myGroups.page+1})}} >Next</button>
        </div>
    )
}