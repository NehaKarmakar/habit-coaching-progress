import { useState ,useContext} from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios"
import LoadingContext from "../contexts/loadingContext"
import { toast } from "react-toastify"
export default function ResetPassword() {
    const [password, setPassword] = useState("")
    const [serverError, setServerError]= useState("")
    const {token} = useParams()
    const handleChange= (e) => {
        setPassword(e.target.value)
        setServerError("")
    }
    const {setLoading} = useContext(LoadingContext)
    const navigate= useNavigate()
    const formValidations= () => {
        if(!password.trim()){
            setServerError("Password is required")
            return false
        }
        else if(password.trim().length<8){
            setServerError( "Password must be atleast 8 charaters")
            return false
        }
        else if(!/[A-Z]/.test(password)){
            setServerError("Password must contain at least one uppercase letter")
            return false
        }
        else if(!/[a-z]/.test(password)){
            setServerError("Password must contain at least one lowercase letter")
            return false
        }
        else if(!/[0-9]/.test(password)){
            setServerError( "Password must contain at least one number" )
            return false
        }
        else if(!/[!@#$%^&*]/.test(password)) {
            setServerError("Password must contain at least one special charaters")
            return false
        }
        return true
    }
    const handleSubmit=  async (e) => {
        e.preventDefault()

        if(!formValidations()) {
            return
        }
        setLoading(true)
        try{
            const response= await axios.post(`/api/auth/resetPassword/${token}`,{password:password})
            console.log(response.data)
            toast("Password reset successfully. You can now log in.")
            navigate("/login")
            setPassword("")
            setServerError("")

        }
        catch(err) {
            console.log("error",err.response?.data?.message)
            setServerError(err.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className="card">
        <div className="flex flex-col items-center gap-8 ">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
            {
                serverError && <p className="text-xl max-sm:text-base font-semibold text-red-700"> {serverError}</p>
                
            }
            <div className="flex justify-center scale-110 max-sm:scale-100 max-sm:w-full max-sm:px-4 ">
            <form onSubmit={handleSubmit}>
                <label className="text-xl max-sm:text-lg"> Password 
                    <input type= "password" name= "password" value= {password} onChange= {handleChange} placeholder="Enter your new password"/>
                </label>
                <input type= "submit" className="!w-full !bg-blue-600 !px-3 !py-2 !text-white !border-0 !rounded-lg !cursor-pointer hover:!bg-blue-700"/>
            </form>
        </div>
        </div>
        </div>
    )
}