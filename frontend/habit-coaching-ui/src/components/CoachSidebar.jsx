import {Link} from "react-router-dom"

export default function CoachSidebar(){
    return(
        
           <aside className="w-48 min-h-screen bg-indigo-900 p-4 text-white">
            <h2 className="text-2xl font-semibold text-amber-400">Menu</h2> <br/>
            <ul className="flex  flex-col  gap-2 text-xl">
                <li className="hover:scale-95 underline "><Link to= "/coach/groups">Groups</Link></li>
                <li className="hover:scale-95 underline "><Link to= "/coach/members">Members</Link></li>
                <li className="hover:scale-95 underline "><Link to= "/coach/habits">Habits</Link></li>
                <li className="hover:scale-95 underline "><Link to= "/coach/progress">Progress</Link></li>
                <li className="hover:scale-95 underline "><Link to= "/leaderboard">Leaderboard</Link></li>
                
            </ul>
           </aside>
        
    )
}