import { createContext, useReducer, useEffect } from "react";
import reducer from "../reducers/Auth-reducer.jsx";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
const AuthContext= createContext()
export default AuthContext

const initialState= {
    isLoggedIn: false,
    user: null
}

export function AuthProvider (props){
       const [state, dispatch] = useReducer(reducer, initialState)
       const navigate= useNavigate()

       useEffect( () => {
        (
            async function fetchProfile(){
                const token= localStorage.getItem("token")
                try{
                 if(token) {
                    const response= await axios.get("/api/auth/profile" ,{headers: {Authorization:token }})
                    dispatch({type: "LOGIN", payload: response.data})
                 }
                }
                catch(err){
                   localStorage.removeItem("token")

                }
            }

        )()
    },[])
       const handleLogin= (token,user) => {
        dispatch( {type: "LOGIN", payload: user})
        localStorage.setItem("token",token)
        if(user.role==="coach"){
        navigate("/coach/dashboard")
        }
        else{
            navigate("/member/dashboard")
        }
        
    } 
       const handleLogout= () => {
        dispatch( {type: "LOGOUT"})
        localStorage.removeItem("token")
       
        navigate("/login")
       }
       return(
        <AuthContext.Provider value= {{...state , dispatch, handleLogin, handleLogout}}>
            {props.children}
         </AuthContext.Provider>
       )
}