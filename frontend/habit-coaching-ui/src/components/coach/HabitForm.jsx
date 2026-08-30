import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import HabitContext from "../../contexts/HabitContex"
import { assignedEditId } from "../../slices/groupSlice"
export default function HabitForm () {
    const [form, setForm] = useState( {
        title:"",
        description: "",
        frequency:"",
        difficulty:"",
        groupName: "",
       
    })
  
    const [serverError, setServerError] = useState("")
    const [resource, setResource] = useState(null)
   const {data,addHabit, editId, assignedEditId,editHabit} = useContext(HabitContext)
    const handleChange =(e) => {
        const {name, value} = e.target
        setForm( {...form, [name] : value})
    }
    const handleSubmit=async (e) => {
        e.preventDefault()
        if(!editId){
        try{
            const response= await axios.post("/api/habits", form, {headers: {Authorization: localStorage.getItem("token")}})
            console.log(response.data)
            let habit= response.data.data
            if(resource){
                const data= new FormData()
              data.append("resource", resource)
              const fileResponse= await axios.post(`/api/habits/resource/${habit._id}`,data, {headers: {Authorization: localStorage.getItem("token")}})
              console.log(fileResponse.data)
              addHabit(fileResponse.data.data)
            }
            else{
          addHabit(response.data.data)
            }
           setForm({
            title: "",
            description: "",
            frequency: "",
            difficulty: "",
            groupName: ""
        });

        setServerError("");
         
        }
        catch(err){
            console.log(err.response.data.message)
           setServerError(err.response.data.message)
        }
    }
    else{
        try{
            const response= await axios.put(`/api/habits/${editId}`, form, {headers: { Authorization: localStorage.getItem("token")}})
            console.log(response.data)
            const habit= response.data.data
            if(resource){
                const data= new FormData()
                data.append("resource", resource)
                const fileResponse= await axios.post(`/api/habits/resource/${editId}`,data, {headers: {Authorization: localStorage.getItem("token")}})
                console.log(fileResponse.data)
                editHabit(fileResponse.data.data)
            }
            else{
               editHabit(response.data.data)
            }
            
            setForm( {
                 title: "",
            description: "",
            frequency: "",
            difficulty: "",
            groupName: ""
            })
            setServerError("")

        }
        catch(err) {
            console.log(err.response?.data?.message)
            setServerError(err.response?.data?.message)
        }
    }
    }
    useEffect( () => {
       if(editId) {
        const habits= data.find( (ele) => {
            return ele._id === editId
        })
        if(habits){
            setForm(
                {
                    title: habits.title,
                    description:habits.description,
                    frequency:habits.frequency,
                    difficulty:habits.difficulty,
                    groupName:habits.groupName

                }
            )
        }
       }
    },[editId, data])
    return(
        <div>
            {
                editId ? <h2>Edit Habit</h2> : <h2>Add Habit</h2>
            }
            {
                editId && <button onClick= { () => {assignedEditId(null)}}>Cancel Edit</button>
            }
            {serverError && <p> {serverError}</p>}
            <form onSubmit= {handleSubmit}>
                <label>
                    Title: 
                    <input type= "text" name= "title" value= {form.title} onChange={handleChange} placeholder="Enter the habit title" required>
                    </input>
                </label>
                <label>
                    Description:
                    <input type="text" name= "description" value= {form.description} onChange= {handleChange} placeholder= "Enter the description of the form">
                </input>
                </label>
                <label>
                    Frequency:
                    <input type= "text" name= "frequency" value={form.frequency} onChange= {handleChange} placeholder=" Daily , Weekly" required></input>
                </label>
                <label>
                    Difficulty:
                    <input type= "text" name= "difficulty" value= {form.difficulty} onChange= {handleChange} placeholder="Easy, Medium, Hard" required></input>
                </label>
                <label>
                    Group Name:
                    <input type= "text" name= "groupName" value= {form.groupName} onChange= {handleChange} placeholder="Enter the group name" required></input>
                </label>
                <label>Resource:
                    <input type= "file" onChange={(e) => {setResource(e.target.files[0])}} />
                </label>
                
                <input type= "submit" value= "Add habit to the group"/>
            </form>
        </div>
    )
}