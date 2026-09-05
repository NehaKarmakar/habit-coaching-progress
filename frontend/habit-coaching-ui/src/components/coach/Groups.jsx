import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {removeGroup,assignedEditId , searchSortPagination , removeServerError} from "../../slices/groupSlice"
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
        <div className="flex min-h-screen gap-8">
            <CoachSidebar/>
            <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold text-center">Groups</h2>
          {
            serverError && <p className="text-xl font-semibold text-red-700"> {serverError}</p>
          } <br/>
          <input type= "text" name= "search" value= {search} onChange={handleChange} placeholder="search by groupname"/>
           <br/>
           {/*sort*/}
           <label className=" font-semibold m-3 p-4">Sort By: 
           <select value= {sort} onChange={(e) =>
             {setSort(e.target.value);
             setPage(1)
             }}>
            
            <option value= "">Select</option>
            <option value= "createdAt">Created Date</option>
            <option value= "groupName">Group Name</option>
            
            </select>
            </label > 
            <label className="font-semibold m-3 p-4">Order:
            <select value= {order}
             onChange= {(e)=> {setOrder(e.target.value); setPage(1)}
             }>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
            </select>
            </label>
           <br/> <br/>

           {searchData.length === 0 && 
                    <p className="text-xl font-semibold text-center text-red-700">
                         No group found.
                    </p>
                
               }<br/>
         
            <table className=" w-full border-collapse border">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Group Name</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Description</th>
                        <th className="border border-black px-6 py-3 hover:bg-blue-900 scale-110 shadow-md">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-black ">
                    
                        {
                            searchData.map( (group) => {
                                return (
                                   <tr key= {group._id}>
                                    <td className="border border-black px-6 py-3 text-center hover:bg-amber-200 scale-110">{group?.groupName || "Group no longer exists"}</td>
                                    <td className="border border-black px-6 py-3  hover:bg-amber-200 scale-110">{group?.description || "Group no longer exists"}</td>
                                    <td className="border border-black px-6 py-3  hover:scale-110">
                                        
                                        
                                        <button onClick= { () => {handleEdit(group._id)}} className="m-2">Edit Group</button>
                                        <button onClick= {() => {handleDelete(group._id)}}>Delete Group</button><br/>
                                        <button onClick= { () => {handleViewHabits(group._id)}} className="m-2">View Habits</button>
                                        <button onClick= {() => {handleAddMember(group._id)}} >Add Member</button>
                                        <button onClick= { () => {handleViewMembers(group._id)}} className="m-2">View Members</button><br/>

                                    </td>
                                   </tr>

                                )
                            })
                        }

                   
                </tbody>
            </table>
            
         {/*Pagination*/}
         <div className="flex justify-center items-center gap-10 mt-10">
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

          </div>
        </div>
         <GroupForm className= "!w-80 p-6"/>
        </div>
    )
}