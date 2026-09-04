import {useState} from "react"
import { addGroup, assignedEditId, editGroup ,removeServerError} from "../../slices/groupSlice"
import { useSelector, useDispatch } from "react-redux"

export default function GroupForm (){
    const{serverError, editId }= useSelector( (State) => {
        return State.groups
    })
    
   const dispatch= useDispatch()
   const [form, setForm] = useState( {
    groupName: "",
    description: ""
})
const [checkError, setCheckError] = useState("")



const handleChange = (e) => {
    const {name, value} = e.target
    setForm( {...form , [name]:value})

    setCheckError("")
    dispatch(removeServerError())
}

const formValidations = () =>{
    if(!form.groupName.trim()) {
        setForm( {...form})
        setCheckError("Group Name is required")
        return false
    }
    else if(form.groupName.trim().length<3){
        setForm( {...form})
        setCheckError("Group Name must have atleast 3 characters")
        return false
    }
    if(!form.description.trim()) {
        setForm({...form})
        setCheckError("Description is required")
        return false
    }
    else if(form.description.trim().length<3) {
        setForm( {...form})
        setCheckError("Description must have atleast 3 characters")
        return false
    }
    return true
}
const handleSubmit= (e) => {
    e.preventDefault()
    if(!formValidations()) {
        return
    }
    if(editId){
        dispatch(editGroup( {id: editId, formData: form}))

        setForm( {
            groupName: "",
            description: ""
        })
        setCheckError("")
    }
    else{
    dispatch(addGroup({formData: form}))
    setForm( {
            groupName: "",
            description: ""
        })
        setCheckError("")
    }
   
}
return(
    <div className="card">
    <div className="flex flex-col items-center gap-8">
        {
            editId ? <h2 className="text-2xl font-semibold">Edit Group</h2> : <h2 className="text-2xl font-semibold">Add Group</h2>
        }
        {
            editId && <button onClick= {() => {dispatch(assignedEditId(null))}}>Cancel edit</button>
        }
        
        {checkError && <p className="text-xl font-semibold text-red-700"> {checkError}</p>}
        <div className="flex justify-center scale-110 ">
        <form onSubmit= {handleSubmit}>
            <label className="text-xl">Title:
            <input type= "text" name= "groupName" value= {form.groupName} onChange= {handleChange} placeholder="Enter the group name"/>
            </label>
            <label className="text-xl">Description: 
                <input type= "text" name= "description" value= {form.description} onChange= {handleChange} placeholder="Enter the group description"/>
            </label>
            <input type= "submit" className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700" />
        </form>

    </div>
    </div>
    </div>
)
}

