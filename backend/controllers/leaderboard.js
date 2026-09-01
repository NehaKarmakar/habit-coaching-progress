import HabitProgress from "../models/habitProgressModel.js"
import User from "../models/userModel.js"
export const leaderBoard = async (req, res) =>{
    try{
     const members = await User.find( {role: "member"})
     const leaderboard=[]
     for(let member of members){
        const completedHabit = await HabitProgress.countDocuments( {member: member._id, completed:true})
        leaderboard.push( {name: member.name , completedHabit: completedHabit})
        }
        leaderboard.sort( (a,b) => {
           return b.completedHabit-a.completedHabit
        })
     return res.status(200).json( {success: true, message: "Leaderboard", data: leaderboard})
    }
    catch(err){
        console.log(err)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const leaderboardAggregate = async (req, res) => {

    try{
       
        const page= Number(req.query.page) || 1
        const limit= Number(req.query.limit) || 5
        const search= req.query.search || ""
        const sort= req.query.sort || "completedHabit"
        const order= req.query.order || "desc"
        const orderData= order==="asc" ? 1:-1

        const pipeline= [] 
        
         pipeline.push({
            $match: {
                role: "member"
            }
         })

         
        pipeline.push({
            $lookup: {
                from: "habitprogresses",
                localField: "_id",
                foreignField: "member",
                as: "completedHabits"
            }
        })
         pipeline.push({
            $addFields: {
                completedHabit: {
                    $size: {
                        $filter: {
                            input: "$completedHabits",
                            as: "habit",
                            cond: {
                                $eq: ["$$habit.completed", true]
                            }
                        }
                    }
                }
            }
        })
        pipeline.push({ 
    $setWindowFields: { 
        sortBy: { 
            completedHabit: -1 
        }, 
        output: { 
            rank: { 
                $rank: {} 
            } 
        } 
    } 
})
           if(search){
            pipeline.push( {
                $match: {
                    name: {
                        $regex:search,
                        $options: "i"
                    }
                }
            })
          }
            pipeline.push( {
            $sort: {
                [sort]:orderData
            }
          })
          pipeline.push( 
            {$skip: (page-1) *limit},
            {$limit: limit}
          )
           
           pipeline.push({
            $project: {
                name: 1,
                email: 1,
                completedHabit: 1,
                rank:1
            }
        })
          let leaderBoard = await User.aggregate(pipeline)
          
          const totalLeaderboard= search? await User.countDocuments({
            role: "member",
            name: {
                $regex: search,
                $options: "i"
            }
            }): await User.countDocuments( {role: "member"})
          //const totalLeaderboard = await User.countDocuments({role:"member"})
          const totalPages = Math.ceil( totalLeaderboard/limit)
          return res.status(200).json( {
            success: true, 
            message: "Leaderboard searching , sorting, pagination",
            data: leaderBoard,
            totalLeaderboard: totalLeaderboard,
            currentPage: page,
            totalPages: totalPages
        })

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}