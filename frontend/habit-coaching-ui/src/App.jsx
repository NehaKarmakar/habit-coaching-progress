
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import MemberDashboard from "./components/MemberDashboard.jsx";
import CoachDashboard from "./components/CoachDashboard.jsx";
import Profile from "./components/Profile.jsx";
import { useContext } from "react";
import AuthContext from "./contexts/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {Link, Routes, Route} from "react-router-dom"
function App() {
  const {dispatch, user, isLoggedIn, handleLogout} = useContext(AuthContext)
    return (
        <div>
          
            <h1>
                Habit Coaching System
            </h1>
           
            {
    isLoggedIn ? (user.role === "coach" ? (
             <div>
                <ul>
                    <li><Link to="/coach/dashboard">Dashboard</Link></li>
                    <li><Link to="/profile">  Profile </Link> </li>
                    <button onClick={handleLogout}>Logout</button>
                </ul>
              </div>

        ) : (

            <div>
                <ul>
                    <li><Link to="/member/dashboard">Dashboard</Link></li>
                    <li><Link to="/profile">  Profile </Link> </li>
                    <button onClick={handleLogout}>Logout</button>
                </ul>
            </div>

        )

    ) : (

        <div>
            <ul>
              <li><Link to= "/login">Login</Link></li>
              <li><Link to= "/register">Register</Link></li>
            </ul>
        </div>
    )
} 
            
         
          <br/><br/>
            <Routes>
              <Route path= "/register" element= {<Register/>} />
              <Route path= "/login" element= {<Login/>} />
              <Route path= "/member/dashboard" element= {
                <PrivateRoute> <MemberDashboard/>
                </PrivateRoute>
                
                } />
                <Route path= "/coach/dashboard" element= {
                <PrivateRoute> <CoachDashboard/>
                </PrivateRoute>
                
                } />
              <Route path= "profile" element= {
                <PrivateRoute>
                  <Profile/>
                </PrivateRoute>
                } />
            </Routes>
        </div>
    );
}

export default App;