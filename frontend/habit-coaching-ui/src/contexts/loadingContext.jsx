import { createContext, useState } from "react";
const LoadingContext = createContext()
export default LoadingContext

export function LoadingProvider(props) {
    const[loading, setLoading] = useState(false)
    console.log("loading: ",loading)
    return(
        <LoadingContext.Provider value= {{loading,setLoading}}>
            {props.children}
             {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        zIndex: 999999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <h1>Loading...</h1>
                </div>
            )}
          
        </LoadingContext.Provider>
    )
}