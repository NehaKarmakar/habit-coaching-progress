import { Link} from "react-router-dom";
export default function MemberSidebar() {
    return(
        
            <aside className="w-48 max-sm:w-32 min-h-screen bg-indigo-900 p-4 text-white">
                <h2 className="text-2xl max-sm:text-xl  font-semibold text-amber-400">  Menu</h2>
                <ul  className="flex  flex-col  gap-2 text-xl max-sm:text-base">
                    <li className="hover:scale-95 underline "><Link to= "/member/groups">My Groups</Link></li>
                    <li className="hover:scale-95 underline "><Link to= "/member/habits">My Habits</Link></li>
                    <li className="hover:scale-95 underline "><Link to= "/member/progress"> My Progress</Link></li>
                    <li className="hover:scale-95 underline "><Link to= "/leaderboard">Leaderboard</Link></li>
                </ul>
            </aside>
        
    )
}