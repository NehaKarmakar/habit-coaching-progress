import {useState, useEffect, useContext} from "react"
import axios from "../../config/axios"
import HabitContext from "../../contexts/HabitContex"
import LoadingContext from "../../contexts/loadingContext"

import { toast } from "react-toastify"
export default function HabitForm () {
    const [form, setForm] = useState( {
        title:"",
        description: "",
        frequency:"",
        difficulty:"",
        groupName: "",
       
    })
   
  const {setLoading} = useContext(LoadingContext)
    const [serverError, setServerError] = useState("")
    const [resource, setResource] = useState(null)
   const {data,addHabit, editId, assignedEditId,editHabit} = useContext(HabitContext)
    const handleChange =(e) => {
        const {name, value} = e.target
        setForm( {...form, [name] : value})
        setServerError("")
    }

    const formValidations = () => {
        if(!form.title.trim()){
            setServerError("Title is required")
            return false
        }
        if (form.title.trim().length < 3) {
             setServerError("Title must be at least 3 characters")
             return false
        }
        if(!form.description.trim()) {
            setServerError("Description is required")
            return false
        }
        if (form.description.trim().length < 3) {
            setServerError("Description must be at least 3 characters")
            return false
        }
        if(!form.frequency.trim()){
            setServerError("Frequency is required")
            return false
        }
        else if(!["Daily", "Weekly", "Monthly"].includes(form.frequency)){
            setServerError("Frequency must be Daily, Weekly  ")
            return false
        }
        if(!form.difficulty.trim()) {
            setServerError("Difficulty is required")
            return false
        }
        else if(!["Easy","Medium","Hard"].includes(form.difficulty)){
            setServerError("Difficulty must be Easy, Medium or Hard")
            return false
        }
        if(!form.groupName.trim()){
            setServerError("Group Name is required")
            return false
        }
        return true
    }
    const handleSubmit=async (e) => {
        e.preventDefault()
        if(!formValidations()){
            return
        }
        
        if(!editId){
            setLoading(true)
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
          addHabit(habit)
          
            }
            toast("Successfully added habit")
           
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
        finally{
            setLoading(false)
        }
    }
    else{
        setLoading(true)
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
               editHabit(habit)
               
            }
          setTimeout(() => {
            window.location.reload()
        }, 3000)
            setForm( {
                 title: "",
            description: "",
            frequency: "",
            difficulty: "",
            groupName: ""
            })
            setServerError("")
            setResource(null)
            assignedEditId(null)
           
         toast("Successfully updated habit")
            
            

        }
        catch(err) {
            console.log(err.response?.data?.message)
            setServerError(err.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }
    }
    useEffect( () => {
       if(editId) {
        const habits= data.find( (ele) => {
            return ele._id === editId
        })
        if(habits){
            console.log("EDIT DATA:", habits)
            setForm(
                {
                    title: habits.title||"",
                    description:habits.description||"",
                    frequency:habits.frequency||"",
                    difficulty:habits.difficulty||"",
                    groupName:habits.group?.[0]?.groupName||"",

                }
            )
        }
       }
    },[editId])
    return(
        <div className="card">
        <div className="flex flex-col items-center gap-8 ">
            {
                editId ? <h2 className="text-2xl font-semibold">Edit Habit</h2> : <h2 className="text-2xl font-semibold">Add Habit</h2>
            }
            {
                editId && <button onClick= { () => 
                    {assignedEditId(null)
                        setForm( {
                 title: "",
            description: "",
            frequency: "",
            difficulty: "",
            groupName: ""
            })
            setServerError("")

                }}>Cancel Edit</button>
            }
            {serverError && <p className="text-xl font-semibold text-red-700"> {serverError}</p>}
            <div className="flex justify-center scale-110 ">
            <form onSubmit= {handleSubmit}>
                <label className="text-xl">
                    Title: 
                    <input type= "text" name= "title" value= {form.title} onChange={handleChange} placeholder="Enter the habit title" >
                    </input>
                </label>
                <label className="text-xl">
                    Description:
                    <input type="text" name= "description" value= {form.description} onChange= {handleChange} placeholder= "Enter the description of the form">
                </input>
                </label >
                <label className="text-xl">
                    Frequency:
                    <input type= "text" name= "frequency" value={form.frequency} onChange= {handleChange} placeholder=" Daily , Weekly" ></input>
                </label>
                <label className="text-xl">
                    Difficulty:
                    <input type= "text" name= "difficulty" value= {form.difficulty} onChange= {handleChange} placeholder="Easy, Medium, Hard" ></input>
                </label>
                <label className="text-xl">
                    Group Name:
                    <input type= "text" name= "groupName" value= {form.groupName} onChange= {handleChange} placeholder="Enter the group name"></input>
                </label>
                <label className="text-xl">Resource:
                    <input type= "file" onChange={(e) => {setResource(e.target.files[0])}}  className="file-input" />
                </label>
                
                <input type= "submit"  className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700" />
            </form>
        </div>
        </div>
        </div>
    )
}