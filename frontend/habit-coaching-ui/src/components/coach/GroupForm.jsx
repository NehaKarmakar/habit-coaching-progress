import {useState} from "react"
import { addGroup, assignedEditId, editGroup } from "../../slices/groupSlice"
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
    }
   
}
return(
    <div>
        {
            editId ? <h2>Edit Group</h2> : <h2>Add Group</h2>
        }
        {
            editId && <button onClick= {() => {dispatch(assignedEditId(null))}}>Cancel edit</button>
        }
        {serverError && <p>{serverError}</p>}
        {checkError && <p> {checkError}</p>}
        <form onSubmit= {handleSubmit}>
            <label>Title:
            <input type= "text" name= "groupName" value= {form.groupName} onChange= {handleChange}/>
            </label>
            <label>Description: 
                <input type= "text" name= "description" value= {form.description} onChange= {handleChange}/>
            </label>
            <input type= "submit" />
        </form>

    </div>
)
}

