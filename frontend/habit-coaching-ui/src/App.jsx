
import Register from "./components/Register.jsx";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Login from "./components/Login.jsx";
import MemberDashboard from "./components/MemberDashboard.jsx";
import CoachDashboard from "./components/CoachDashboard.jsx";
import Profile from "./components/Profile.jsx";
import ForgetPassword from "./components/forgetPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

import GroupEnrollment from "./components/coach/GroupEnrollment.jsx";
import Groups from "./components/coach/Groups.jsx";
import Habits from "./components/coach/Habits.jsx";
import MemberProgress from "./components/coach/MemberProgress.jsx";
import MembersLeaderboard from "./components/coach/MembersLeaderboard.jsx";
import GroupMembers from "./components/coach/GroupMembers.jsx";
import Members from "./components/coach/members.jsx";

import MyGroups from "./components/member/MyGroups.jsx";
import MyHabits from "./components/member/MyHabits.jsx";
import MyProgress from "./components/member/MyProgress.jsx";


import { useContext } from "react";
import AuthContext from "./contexts/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {Link, Routes, Route,Navigate} from "react-router-dom"
import GroupHabits from "./components/coach/GroupHabits.jsx";
import ProgressSummary from "./components/coach/progressSummary.jsx";
import MemberGroups from "./components/coach/memberGroup.jsx";
import UpdateProfile from "./components/updateProfile.jsx";
function App() {
  const {dispatch, user, isLoggedIn, handleLogout} = useContext(AuthContext)
    return (
        <div className= "min-h-screen bg-blue-50">
             <ToastContainer />
            <h1 className="text-2xl max-sm:text-xl text-white font-semibold bg-indigo-900 p-6 max-sm:p-4 text-center border-4 rounded-none hover:shadow-md">
                Habit Coaching System
            </h1>
           
            {
    isLoggedIn ? (user.role === "coach" ? (
             <div className="hover:shadow-md px-6 py-3">
                <ul className="flex flex-wrap justify-end max-sm:justify-center gap-2 max-sm:gap-3 text-xl max-sm:text-base">
                    <li className="hover:scale-95 underline"><Link to="/coach/dashboard" >Dashboard</Link></li>|
                    <li className="hover:scale-95 underline"><Link to="/profile" >  Profile </Link> </li>|
                    <button onClick={handleLogout}>Logout</button>
                </ul>
              </div>

        ) : (

            <div className="hover:shadow-md  px-6 py-3">
                <ul className="flex flex-wrap justify-end max-sm:justify-center gap-2 max-sm:gap-3 text-xl max-sm:text-base">
                    <li className="hover:scale-95 underline "><Link to="/member/dashboard" >Dashboard</Link></li>|
                    <li className="hover:scale-95 underline "><Link to="/profile" >  Profile </Link> </li>|
                    <button onClick={handleLogout} >Logout</button>
                </ul>
            </div>

        )

    ) : (

        <div className="hover:shadow-md px-6 py-3 ">
            
            <ul className="flex flex-wrap justify-end max-sm:justify-center gap-2 max-sm:gap-3 text-xl max-sm:text-base">
              <li className="hover:scale-95 underline "><Link to= "/login" >Login</Link></li> |
              <li className="hover:scale-95 underline "><Link to= "/register" >Register</Link></li>
             
            </ul>
            
        </div>
    )
} 
            
         
          <br/><br/>
            <Routes>
                <Route
    path="/"
    element={
      isLoggedIn
        ? <Navigate to={user.role === "coach" ? "/coach/dashboard" : "/member/dashboard"} />
        : <Navigate to="/login" />
    }
  />
              <Route path= "/register" element= {<Register/>} />
              <Route path= "/login" element= {<Login/>} />
              <Route path="/user/forgetPassword" element= {<ForgetPassword/>}/>
              <Route path="/resetPassword/:token" element= {<ResetPassword/>}/>
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
                <Route path= "/coach/groups" element= {
                    <PrivateRoute>
                        <Groups/>
                    </PrivateRoute>
                }/>
                <Route path= "/coach/groups/Enrollment" element= {
                    <PrivateRoute>
                        <GroupEnrollment/>
                    </PrivateRoute>
                }/>
                <Route path= "/coach/members" element= {
                    <PrivateRoute>
                        <Members/>
                    </PrivateRoute>

                }/>
                <Route path= "/coach/habits" element= {
                    <PrivateRoute>
                        <Habits/>
                    </PrivateRoute>
                }/>
                <Route path= "/coach/progress" element= {
                    <PrivateRoute>
                        <MemberProgress/>
                    </PrivateRoute>
                }/>
                <Route path= "/leaderboard" element= {
                    <PrivateRoute>
                        <MembersLeaderboard/>
                    </PrivateRoute>
                }/>
                <Route path= "/member/groups" element= {
                    <PrivateRoute>
                        <MyGroups/>
                    </PrivateRoute>
                }/>
                <Route path= "/member/habits" element= {
                    <PrivateRoute>
                        <MyHabits/>
                    </PrivateRoute>
                }/>
                <Route path= "/member/progress" element= {
                    <PrivateRoute>
                        <MyProgress/>
                    </PrivateRoute>
                }/>
                
                <Route path="/coach/habits/:id" element= {
                    <PrivateRoute>
                        <GroupHabits/>
                    </PrivateRoute>
                } />
                <Route path="/coach/groups/Enrollment/:id" element= {
                    <PrivateRoute>
                        <GroupMembers/>
                    </PrivateRoute>
                } />

                <Route path="/coach/groups/enrollments/add/:id" element= {
                    <PrivateRoute>
                        <GroupEnrollment/>
                    </PrivateRoute>
                } />
                <Route
    path="/coach/member/progress/summary/:id"
    
    element={
        <PrivateRoute>
             <ProgressSummary />
        </PrivateRoute>
   }/>
                <Route path="/coach/member/groups/:id" element= {
                    <PrivateRoute>
                        <MemberGroups/>
                    </PrivateRoute>
                } />
                <Route path="/profile/update/:id" element= {
                    <PrivateRoute>
                        <UpdateProfile/>
                    </PrivateRoute>
                } />
                
            </Routes>
        </div>
    );
}


export default App;
