import { genrateHabitAdvice }from "../utilis/gemini.js"
import Group from "../models/groupModel.js"
import User from "../models/userModel.js"
import Habits from "../models/habitModel.js"
import HabitProgress from "../models/habitProgressModel.js"
import Habit from "../models/habitModel.js"
import GroupEnrollment from "../models/groupEnrollmentModel.js"
import Quote from "../models/quoteModel.js"
import axios from "axios"


import dayjs from "dayjs"
export const coachDashboard = async (req, res) => {
   try{
      const totalGroups = await Group.countDocuments()
      const totalMembers = await User.countDocuments({role: "member"})
      const totalHabits = await Habit.countDocuments()

      const startOfDay= dayjs().startOf("day").toDate()
      const endOfDay= dayjs().endOf("day").toDate()
      
      const totalDailyProgress = await HabitProgress.countDocuments( {
        completed: true, 
        completedDate: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })

    const startOfWeek = dayjs().startOf("week").toDate()
    const endOfWeek= dayjs().endOf("week").toDate()
    const totalWeeklyProgress = await HabitProgress.countDocuments( {
        completed: true,
        completedDate: {
            $gte: startOfWeek,
            $lte: endOfWeek
        }
    })

    const startOfMonth= dayjs().startOf("month").toDate()
    const endOfMonth= dayjs().endOf("month").toDate()
    const totalMonthlyProgress= await HabitProgress.countDocuments( {
        completed: true,
        completedDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    })

    const existingQuote= await Quote.findOne()
    let quote;

    if(existingQuote){
        quote= existingQuote
    }
    else{

    const response= await axios.get( "https://dummyjson.com/quotes/random")
    const data= response.data
    console.log(data)
    const newQuote= new Quote( { content: data.quote, author: data.author})
    quote= await newQuote.save()
    }
    return res.status(200).json( {
          success: true,
          message: "Coach Dashboard" ,
          totalGroups: totalGroups,
          totalMembers: totalMembers,
          totalHabits: totalHabits,
          totalDailyProgress: totalDailyProgress,
          totalWeeklyProgress: totalWeeklyProgress,
          totalMonthlyProgress: totalMonthlyProgress,
          motivationalQuote: quote
         
         })
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const memberDashboard= async (req, res) => {
    const member = req.userId
    try{
        // joined groups

        const memberEnrollment = await GroupEnrollment.find( {member})
        if(!memberEnrollment){
            return res.status(404).json( {success: false, message: "Member not enrolled"})
        }
        const groupId= memberEnrollment.map( item=> item.group)
        const assignedGroups= await Group.find( {_id: {$in: groupId}})


        //assigned habits 
        const enrollments = await GroupEnrollment.find({member});
         console.log(enrollments)
         if(!enrollments){
            return res.status(404).json( {success: false, message: "Member not enrolled"})
         }
        const groupIds = enrollments.map(item => item.group);

        const assignedHabits = await Habit.find({
        group: { $in: groupIds }
        });
        
        
        const startOfDay = dayjs().startOf("day").toDate()
        const endOfDay = dayjs().endOf("day").toDate()
        const totalDailyProgress= await HabitProgress.countDocuments( {
            member,
            completed:true,
            completedDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        const startOfWeek= dayjs().startOf("week").toDate()
        const endOfWeek= dayjs().endOf("week").toDate()
        const totalWeeklyProgress= await HabitProgress.countDocuments( {
            member,
            completed:true,
            completedDate: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        })

        const startOfMonth= dayjs().startOf("month").toDate()
        const endOfMonth= dayjs().endOf("month").toDate()
        const totalMonthlyProgress= await HabitProgress.countDocuments( {
            member,
            completed: true,
            completedDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        })

        const habitProgress = await HabitProgress.find({
            member,
            completed: true
        }).sort({ completedDate: -1 });


       
        let currentStreak = 0;
        let date = dayjs();

        for (let item of habitProgress) {

            const progressDate = dayjs(item.completedDate);

            if (progressDate.isSame(date, "day")) {
                currentStreak++;
                date = date.subtract(1, "day");
            } else {
                break;
            }
        }

        const allProgress = await HabitProgress.find({
            member,
            completed: true
        }).sort({ completedDate: 1 });

        let longestStreak = 0;
        let streak = 0;
        let previousDate = null;

        for (let item of allProgress) {

            const currentDate = dayjs(item.completedDate);

            if (
                previousDate &&
                currentDate.diff(previousDate, "day") === 1
            ) {
                streak++;
            } else {
                streak = 1;
            }
             if (streak > longestStreak) {
                longestStreak = streak;
            }

            previousDate = currentDate;
        }

        const existingQuote= await Quote.findOne()
        let quote;
        if(existingQuote){
            quote= existingQuote
        }
        else{
            const response= await axios.get("https://dummyjson.com/quotes/random")
            const data= response.data
            console.log(data)
            const newQuote= new Quote( {content: data.quote, author: data.author })
            quote= await newQuote.save()
            }

        const prompt=  `You are a habit coach.

The member has:
- Daily completed habits: ${totalDailyProgress}
- Weekly completed habits: ${totalWeeklyProgress}
- Monthly completed habits: ${totalMonthlyProgress}
- Current streak: ${currentStreak} days
- Longest streak: ${longestStreak} days

Give a short, encouraging habit-coaching message.
Keep it under 50 words.`

        const aiAdvice= await  genrateHabitAdvice(prompt)
         console.log(aiAdvice)
        
        return res.status(200).json( {
            success: true, 
            message: "Member dashboard ",
            assignedGroups: assignedGroups, 
            assignedHabits: assignedHabits,
            totalDailyProgress:totalDailyProgress ,
            totalWeeklyProgress: totalWeeklyProgress,
            totalMonthlyProgress:totalMonthlyProgress,
            memberCurrentStreak: currentStreak,
            memberLongestStreak: longestStreak,
            motivationalQuote: quote,
            advice: aiAdvice

            })

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

