import HabitProgress from "../models/habitProgressModel.js";
import User from "../models/userModel.js";
import Habit from "../models/habitModel.js";
import dayjs from "dayjs";

export const markHabitComplete = async (req, res) => {
    const {habit} = req.body
    try{
     const existingHabit = await Habit.findOne({_id: habit})
     if(!existingHabit){
        return res.status(404).json( {success: false, message: "Habit not found"})
     }
     const startOfDay= dayjs().startOf("day").toDate()
     const endOfDay= dayjs().endOf("day").toDate()
     const alreadyMarkHabitComplete= await HabitProgress.findOne( {
        habit,
        member: req.userId, 
        completed: true,
        completedDate:{
            $gte: startOfDay,
            $lte: endOfDay
        }})
        console.log("habit",habit)
        if(alreadyMarkHabitComplete){
            return res.status(400).json( {success: false, message: "Habit already mark "})
        }

        const habitProgress= new HabitProgress( 
            {habit,
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

export const memberDailyProgress = async (req, res) => {
    const {member} = req.body
    try{
        const startOfDay = dayjs().startOf("day").toDate()
        const endOfDay = dayjs().endOf("day").toDate()
        const habitProgress = await HabitProgress.find({
         member,
         completed:true,
         completedDate: {
            $gte: startOfDay,
            $lte: endOfDay
        }}).populate("member" ,"name email").populate("habit" ,"title")
     if(!habitProgress){
        return res.status(404).json( {success: false, message: "Daily habit progress not found"})
     }
     return res.status(200).json( {success: true, message: " Daily habit progress found", data: habitProgress})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({success: false, message: err.message})
    }
}

export const memberWeeklyProgress = async (req, res) => {
    const {member} = req.body
    try{
        const startOfWeek = dayjs().startOf("week").toDate()
        const endOfWeek = dayjs().endOf("week").toDate()
        const habitProgress= await HabitProgress.find( {
            member,
            completed:true,
            completedDate:{
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        }).populate("member" ,"name email").populate("habit","title")

        if(!habitProgress) {
             return res.status(404).json( {success: false , message: "Weekly habit Progress not found"})
        }

        return res.status(200).json( {success: true, message: "Weekly habit progress found" , data: habitProgress})

    }
    catch(err){
       console.log(err.message)
       return res.status(500).json( {success: false, message: err.message})
    }
}

export const memberMonthlyProgress = async (req, res) => {
    const {member} = req.body
    try{
        const startOfMonth = dayjs().startOf("month").toDate()
        const endOfMonth= dayjs().endOf("month").toDate()
      const habitProgress= await HabitProgress.find( {
        member,
        completed:true,
        completedDate:{
            $gte: startOfMonth,
            $lte: endOfMonth
        }
      }).populate("member", "name email").populate("habit", "title")
      if(!habitProgress){
        return res.status(404).json( {success: false, message: "Monthly habit progress not found"})
      }
      return res.status(200).json( {success: true, message: "Monthly habit progress found", data: habitProgress})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const currentStreak = async (req, res) => {
    const {member} = req.body
    try{
       const habitProgress = await HabitProgress.find( {
        member,
        completed:true
       }).sort( {completedDate: -1}).populate("member" , "name email")
       if(!habitProgress) {
        return res.status(404).json( {success: false, message: "Habit progress not found"})
       }
       let streak = 0
       let date= dayjs()

       for( let item of habitProgress){
        const habitProgressDate = dayjs(item.completedDate)
        if(habitProgressDate .isSame(date, "day")){
            streak++
            date= date.subtract(1, "day")
        }
        else{
            break
        }
       }
       return res.status(200).json( {success: true, message: " Current streak calculated " ,data:habitProgress, streak:streak})
       
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json({success: false, message: err.message})
    }
}
export const longestStreak = async (req, res) => {
    const {member} = req.body
    try{
        const habitProgress = await HabitProgress.find( {
            member,
            completed: true
        }).sort( {completedDate: -1}).populate("member" , "name email")
        if(!habitProgress){
            return res.status(404).json( {success: false, message: "Habit Progress not found" })
        }

        let streak= 0
        let longest=0
        let previousDate= null
        for(let item of habitProgress){
            const currentDate = dayjs(item.completedDate)
            if(previousDate && currentDate.diff(previousDate , "day") ===1){
                streak++
            }
            else{
                streak=1
            }
            if(streak>longest){
                longest=streak
            }
            previousDate=currentDate
        }
        return res.status(200).json( {success: true, message: "Longest streak calculated" , data: habitProgress, streak: streak})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, mesaage: err.message})
    }
}

export const habitProgressAggregate = async (req, res) => {
    try{
       const page= Number(req.query.page) || 1
       const limit= Number(req.query.limit) || 1
       const search= req.query.search || ""
       const sort= req.query.sort || "createdAt"
       const order= req.query.order || "desc"
       const orderData= order==="asc" ? 1:-1

       const pipeline = [] // total records
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