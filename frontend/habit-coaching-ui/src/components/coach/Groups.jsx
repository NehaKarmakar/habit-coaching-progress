import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {fetchGroups, removeGroup,assignedEditId , searchSortPagination} from "../../slices/groupSlice"


import GroupForm from "./GroupForm"
import CoachSidebar from "../CoachSidebar"
export default function Groups() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("createdAt")
    const [order, setOrder] = useState("desc")
    const dispatch = useDispatch()
    const {
       
        searchData,
        
        currentPage,
        totalPages
    } = useSelector((state) => state.groups)
    const groups= useSelector( (state) => {
        return state.groups.data
    })
    const serverError = useSelector( (state) => {
        return state.groups.serverError
    })
    const navigate= useNavigate()
    useEffect( () => {
    dispatch(fetchGroups())
    },[])
     useEffect(() => {
        dispatch(searchSortPagination({
            search,
            page,
            limit: 5,
            sort,
            order
        }))
    }, [search, page, sort, order,dispatch])
    if(!groups){
        return <p>Loading...</p>
    }

    const handleChange= (e) => {
        setSearch(e.target.value)
        setPage(1)
    }
    const handleDelete= (groupId) => {
        const confirmation = window.confirm("Are you sure want to delete the group?")
        if(confirmation){
       dispatch(removeGroup({id:groupId}))
        }
       
    }
    const handleEdit= (groupId) =>{
    dispatch(assignedEditId(groupId))
    }

    const handleAddMember= (groupId) => {
        navigate(`/coach/groups/enrollments/add/${groupId}`)

    }

    
    return(
        <div>
            <CoachSidebar/>
            <h2>Groups</h2>
          {serverError && <p>{serverError} </p>}
          <input type= "text" name= "search" value= {search} onChange={handleChange} placeholder="search by groupname"/>
           {/*sort*/}
           <select value= {sort} onChange={(e) =>
             {setSort(e.target.value);
             setPage(1)
             }}>
            
            <option value= "">select</option>
            <option value= "createdAt">Created Date</option>
            <option value= "groupName">Group Name</option>
            
            </select>
            <select value= {order}
             onChange= {(e)=> {setOrder(e.target.value); setPage(1)}
             }>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
            </select>

         <ul>
            {
                searchData.map( (group) => {
                    return(
                        <div key= {group._id}>
                            <h3>{group.groupName}</h3>
                            <p>Id: {group._id}</p>
                            <p> Description: {group.description}</p>
                            
                            <Link to= {`/coach/habits/${group._id}`}>View Habits</Link>
                            <Link to= {`/coach/groups/Enrollment/${group._id}`}>View Members</Link>
                            <button onClick= { () => {handleEdit(group._id)}}>Edit</button>
                            <button onClick= {() => {handleDelete(group._id)}}>Delete</button>
                            <button onClick= {() => {handleAddMember(group._id)}}>Add Member</button>
                            
                        </div>
                    )
                })
            }

         </ul>
         {/*Pagination*/}
         <button
                disabled={currentPage === 1}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>

            <span>
                {" "} Page {currentPage} of {totalPages} {" "}
            </span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>

           <GroupForm />
        </div>
    )
}