import {Link} from "react-router-dom"

export default function CoachSidebar(){
    return(
        <div>
           <aside>
            <h2> Coach Menu</h2>
            <ul>
                <li><Link to= "/coach/groups">Groups</Link></li>
                <li><Link to= "/coach/members">Members</Link></li>
                <li><Link to= "/coach/habits">Habits</Link></li>
                <li><Link to= "/coach/progress">Progress</Link></li>
                <li><Link to= "/leaderboard">Leaderboard</Link></li>
                
            </ul>
           </aside>
        </div>
    )
}