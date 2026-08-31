import { createContext, useState } from "react";
const LoadingContext = createContext()
export default LoadingContext

export function LoadingProvider(props) {
    const[loading, setLoading] = useState(false)
    return(
        <LoadingContext.Provider value= {{loading,setLoading}}>
            {props.children}
            {
                loading && <p>Loading...</p>
            }
          
        </LoadingContext.Provider>
    )
}