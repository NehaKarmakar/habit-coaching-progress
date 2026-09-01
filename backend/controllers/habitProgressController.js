import HabitProgress from "../models/habitProgressModel.js";
import User from "../models/userModel.js";
import Habit from "../models/habitModel.js";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { calculateCurrentStreak , calculateLongestStreak} from "../utilis/streak.js"

export const markHabitComplete = async (req, res) => {
    const {habit} = req.body
    try{
     const existingHabit = await Habit.findOne({_id:habit})
     if(!existingHabit){
        return res.status(404).json( {success: false, message: "Habit not found"})
     }
     const startOfDay= dayjs().startOf("day").toDate()
     const endOfDay= dayjs().endOf("day").toDate()
     const alreadyMarkHabitComplete= await HabitProgress.findOne( {
        habit,
        member: req.userId, 
       
        completedDate:{
            $gte: startOfDay,
            $lte: endOfDay
        }})
      
        if(alreadyMarkHabitComplete){
             alreadyMarkHabitComplete.completed =
                !alreadyMarkHabitComplete.completed

            if(alreadyMarkHabitComplete.completed){
                //on
                
                alreadyMarkHabitComplete.completedDate=dayjs().toDate()
                
            
                }
                else{
                    //off
                    
                    alreadyMarkHabitComplete.completedDate=null
                }

                 const updateProgress= await alreadyMarkHabitComplete.save()
                return res.status(200).json( {success: true, message: "Successfully toggled", data:updateProgress})

        }
       
        const habitProgress= new HabitProgress( 
            {habit: existingHabit._id,
            member: req.userId,
            completed: true,
            completedDate: dayjs().toDate()
        })
        const habitProgressRecord = await habitProgress.save()
        await habitProgressRecord.populate("member" , "name email")
        return res.status(201).json( {success: true, message: "Hbit progress marked successfully", data: habitProgressRecord})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const membersProgress= async (req, res) => {
    const inComingId= req.params.id || req.userId
    console.log("params:", req.params)
    console.log("userId:", req.userId)
    console.log("memberId:", inComingId)
     if (!mongoose.Types.ObjectId.isValid(inComingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid member ID"
            })
        }

    try{
        const memberId = new mongoose.Types.ObjectId(inComingId)
        
        
        const startOfDay= dayjs().startOf("day").toDate()
        const endOfDay= dayjs().endOf("day").toDate()

        const startOfWeek= dayjs().startOf("week").toDate()
        const endOfWeek= dayjs().endOf("week").toDate()

        const startOfMonth= dayjs().startOf("month").toDate()
        const endOfMonth= dayjs().endOf("month").toDate()

        const dailyProgress= await HabitProgress.find( {
            member: memberId,
            completed: true,
            completedDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate("habit", "title")
        console.log("Daily Progress", dailyProgress)

        const weeklyProgress= await HabitProgress.find( {
            member: memberId,
            completed: true,
            completedDate: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        }).populate("habit", "title")
        console.log("weeklyProgress", weeklyProgress)

        const monthlyProgress= await HabitProgress.find( {
            member: memberId,
            completed:true,
            completedDate: {
                $gte: startOfMonth,
                $lte:endOfMonth
            }

        }).populate("habit","title")
         console.log("monthlyProgress", monthlyProgress)

        const currentStreak= await HabitProgress.find( {
            member: memberId,
            completed:true
        }).sort({completedDate:-1}).populate("member" ,"name email")
         const current_streak = calculateCurrentStreak(currentStreak)
          console.log("currentStreak", current_streak)

         const longestStreak= await HabitProgress.find( {
            member: memberId,
            completed:true
         }).sort( {completedDate: 1})
          const longest_streak = calculateLongestStreak(longestStreak)
          console.log("longestStreak", longest_streak)
          

          return res.status(200).json( {success: true, message: "Members Progress" , dailyProgress:dailyProgress, weeklyProgress: weeklyProgress, monthlyProgress: monthlyProgress, current_streak:current_streak, longest_streak:longest_streak})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message:err.message})
    }
}

export const habitProgressAggregate = async (req, res) => {
    try{
       const page= Number(req.query.page) || 1
       const limit= Number(req.query.limit) || 5
       const search= req.query.search || ""
       const sort= req.query.sort || "createdAt"
       const order= req.query.order || "desc"
       const orderData= order==="asc" ? 1:-1

       const pipeline = [] // total records
       pipeline.push({
       $match: {
        completed: true
        }
      })
       pipeline.push( {
            $lookup: {
              from: "users",
              localField: "member",
              foreignField: "_id",
              as: "memberDetails"
            }
        })
        pipeline.push( {
            $lookup: {
              from: "habits",
              localField: "habit",
              foreignField: "_id",
              as: "habitDetails"
            }
        })

        if(search){
             pipeline.push({
                $match: {
                    $or: [
                        {
                          "memberDetails.name": {
                                $regex: search,
                                $options: "i"
                            }
                        },
                        {
                            "habitDetails.title": {
                                $regex: search,
                                $options: "i"
                            }
                        }
                    ]
                }
          });
        }


     

       pipeline.push( {
        $sort: {
            [sort] : orderData
        }
       })

       pipeline.push( 
        {$skip: (page-1) *limit},
        {$limit: limit}
       )

      //If you didn't put search in the main pipeline, you would return all HabitProgress records
      //  even though the user searched for "John".
       

        const habitProgress = await HabitProgress.aggregate(pipeline)

        const countPipeline= [] // how many records match
        countPipeline.push({
    $match: {
        completed: true
    }
})
        countPipeline.push( {
            $lookup: {
                from:"users",
                localField: "member",
                foreignField: "_id",
                as: "memberDetails"
            }
        })

        countPipeline.push( {
            $lookup: {
                from : "habits",
                localField: "habit",
                foreignField:"_id",
                as: "habitDetails"
            }
        })
        if(search){
             countPipeline.push({
                $match: {
                    $or: [
                        {
                          "memberDetails.name": {
                                $regex: search,
                                $options: "i"
                            }
                        },
                        {
                            "habitDetails.title": {
                                $regex: search,
                                $options: "i"
                            }
                        }
                    ]
                }
          });
        }

       countPipeline.push( {
            $count: "total"
        })

        const countResult = await HabitProgress.aggregate(countPipeline)
        const totalHabitProgress = countResult[0]?.total || 0
        const totalPages = Math.ceil(totalHabitProgress/limit)

        return res.status(200).json( {success: true, message: "Habit Progress search sorting pagination", 
            data:habitProgress , totalHabitProgress: totalHabitProgress, currentPage: page, totalPages: totalPages})
    }
    catch(err){
        console.log(err.message)
        return res. status(500).json( {success: false, message: err.message})
    }
}