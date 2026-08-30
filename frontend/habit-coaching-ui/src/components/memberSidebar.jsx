import { Link} from "react-router-dom";
export default function MemberSidebar() {
    return(
        <div>
            <aside>
                <ul>
                    <li><Link to= "/member/groups">My Groups</Link></li>
                    <li><Link to= "/member/habits">My Habits</Link></li>
                    <li><Link to= "/member/progress"> My Progress</Link></li>
                    <li><Link to= "/leaderboard">Leaderboard</Link></li>
                </ul>
            </aside>
        </div>
    )
}