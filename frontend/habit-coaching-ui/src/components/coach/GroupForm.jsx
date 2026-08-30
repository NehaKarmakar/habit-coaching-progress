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

const handleChange = (e) => {
    const {name, value} = e.target
    setForm( {...form , [name]:value})
}

const handleSubmit= (e) => {
    e.preventDefault()
    if(editId){
        dispatch(editGroup( {id: editId, formData: form}))
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

