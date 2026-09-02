import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {removeGroup,assignedEditId , searchSortPagination} from "../../slices/groupSlice"
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
    
    const serverError = useSelector( (state) => {
        return state.groups.serverError
    })
    const navigate= useNavigate()
    
     useEffect(() => {
        dispatch(searchSortPagination({
            search,
            page,
            limit: 5,
            sort,
            order
        }))
    }, [search, page, sort, order,dispatch])

   
    

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

    const handleViewHabits= (groupId) => {
        navigate(`/coach/habits/${groupId}`)
    }
    const handleViewMembers= (groupId) => {
        navigate(`/coach/groups/Enrollment/${groupId}`)
    }

    
    return(
        <div>
            <CoachSidebar/>
            <h2>Groups</h2>
          {
            serverError && <p> {serverError}</p>
          }
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
            

         
            <table>
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {
                            searchData.map( (group) => {
                                return (
                                   <tr>
                                    <td>{group.groupName}</td>
                                    <td>{group.description}</td>
                                    <td>
                                        <button onClick= { () => {handleViewHabits(group._id)}}>View Habits</button>
                                        <button onClick= { () => {handleViewMembers(group._id)}}>View Members</button>
                                        <button onClick= { () => {handleEdit(group._id)}}>Edit</button>
                                        <button onClick= {() => {handleDelete(group._id)}}>Delete</button>
                                        <button onClick= {() => {handleAddMember(group._id)}}>Add Member</button>

                                    </td>
                                   </tr>

                                )
                            })
                        }

                   
                </tbody>
            </table>
            
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