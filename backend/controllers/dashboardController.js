import mongoose from "mongoose"
import { genrateHabitAdvice }from "../utilis/gemini.js"
import Group from "../models/groupModel.js"
import User from "../models/userModel.js"
import HabitProgress from "../models/habitProgressModel.js"
import Habit from "../models/habitModel.js"
import GroupEnrollment from "../models/groupEnrollmentModel.js"
import Quote from "../models/quoteModel.js"
import { calculateCurrentStreak,calculateLongestStreak } from "../utilis/streak.js"
import axios from "axios"
import dayjs from "dayjs"

export const coachDashboard = async (req, res) => {
   try{
    const startOfDay= dayjs().startOf("day").toDate()
    const endOfDay= dayjs().endOf("day").toDate()

    const startOfWeek= dayjs().startOf("week").toDate()
    const endOfWeek= dayjs().endOf("week").toDate()

    const startOfMonth= dayjs().startOf("month").toDate()
    const endOfMonth= dayjs().endOf("month").toDate()

    const groupData= await Group.aggregate( [
        {$count: "totalGroups"}
    ])

    const memberData= await User.aggregate( [
        {
            $match: {
                role: "member"
            }
        },
        {$count: "totalMembers"}
    ])

    const habitData= await Habit.aggregate( [
        {$count: "totalHabits"}
    ])

    const progressData= await HabitProgress.aggregate([
        {
            $facet:{
                dailyProgress: [
                    {
                        $match: {
                            completed: true,
                            completedDate: {
                                $gte: startOfDay,
                                $lte:endOfDay
                            }
                        }
                    },
                    {$count: "totalDailyProgress"}
                ],

                weeklyProgress: [
                    {
                        $match: {
                            completed: true,
                            completedDate: {
                                $gte: startOfWeek,
                                $lte:endOfWeek
                            }
                        }
                    },
                    {$count: "totalWeeklyProgress"}
                ],

                monthlyProgress: [
                    {
                        $match: {
                            completed: true,
                            completedDate:{
                                $gte: startOfMonth,
                                $lte: endOfMonth
                            }
                        }
                    },
                    {$count: "totalMonthlyProgress"}
                ],
                chartData: [
                    {
                        $match: {
                            completed: true,
                        }
                    },
                    {
                       $group: {
                        _id: {
                            $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$completedDate"
                                    }
                        },
                          completed: {
                                    $sum: 1
                                }

                       },
                       
                    },
                    {
                            $sort: {
                                _id: 1
                            }
                        }
                ]
                
            }
        }
    ])

    const totalGroups= groupData[0]?.totalGroups || 0
    const totalMembers= memberData[0]?.totalMembers || 0
    const totalHabits= habitData[0]?.totalHabits || 0
    const totalDailyProgress= progressData[0]?.dailyProgress[0]?.totalDailyProgress || 0
    const totalWeeklyProgress= progressData[0]?.weeklyProgress[0]?.totalWeeklyProgress || 0
    const totalMonthlyProgress= progressData[0]?.monthlyProgress[0]?.totalMonthlyProgress || 0
    const dailyChart= progressData[0]?.chartData || []

    const existingQuote= await Quote.findOne()
    let quote;
    if(existingQuote){
        quote= existingQuote
    }
    else{
        const response= await axios.get("https://dummyjson.com/quotes/random")
        const data= response.data
        const newQuote= new Quote( {content: data.quote, author: data.author})
        quote= await newQuote.save()
    }

    return res.status(200).json( {success: true, message: "Coach Dashboard",
        totalGroups: totalGroups,
        totalMembers: totalMembers,
        totalHabits: totalHabits,
        totalDailyProgress:totalDailyProgress,
        totalWeeklyProgress:totalWeeklyProgress,
        totalMonthlyProgress:totalMonthlyProgress,
        dailyChart:dailyChart,
        motivationalQuote:quote
    })
        
   }
   catch(err){
    console.log(err.message)
    return res.status(500).json( {success: false, message: err.message})
   }
}

export const memberDashboard= async (req, res) => {
    const member = req.userId
    const memberId= new mongoose.Types.ObjectId(member)
    try{
        
        const startOfDay= dayjs().startOf("day").toDate()
        const endOfDay= dayjs().endOf("day").toDate()

        const startOfWeek= dayjs().startOf("week").toDate()
        const endOfWeek= dayjs().endOf("week").toDate()

        const startOfMonth= dayjs().startOf("month").toDate()
        const endOfMonth= dayjs().endOf("month").toDate()

        const enrollmentData= await GroupEnrollment.aggregate( [
            {
                $match: {
                    member: memberId
                }
            },
            {
                $group: {
                    _id: null,
                    groupId: {
                        $addToSet: "$group"
                    }
                }
            }
        ])

        const groupIds = enrollmentData[0]?.groupId || []

        const assignedGroups = await Group.aggregate( [
            {
                $match: {
                    _id:{
                        $in: groupIds
                    }
                }
            }
        ])

        const assignedHabits= await Habit.aggregate([
            {
                $match: {
                    group: {
                        $in:groupIds
                    }
                }
            }
        ])

        const progressData= await HabitProgress.aggregate( [
            {
                $match: {
                    member: memberId
                }
            },
            {
                $facet: {
                    dailyProgress: [
                        {
                            $match: {
                                completed:true,
                                completedDate: {
                                    $gte: startOfDay,
                                    $lte:endOfDay
                                }
                            }
                           
                        },
                         {$count: "totalDailyProgress"}
                    ],

                    weeklyProgress: [
                        {
                            $match: {
                                completed: true,
                                completedDate: {
                                    $gte: startOfWeek,
                                    $lte: endOfWeek
                                }
                            }
                        },
                        {$count: "totalWeeklyProgress"}
                    ],

                    monthlyProgress: [
                        {
                            $match: {
                                completed: true,
                                completedDate: {
                                    $gte: startOfMonth,
                                    $lte: endOfMonth
                                }
                            }
                        },
                        {$count: "totalMonthlyProgress"}
                    ],
                    chartData: [
                        {
                            $match: {
                                completed:true
                            }
                        },
                        {
                        $group: {
                                    _id:{
                                         $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$completedDate"
                                    }
                                },
                                
                                completed: {
                                      $sum: 1
                                    }
                            }
                        },

                       
                    {
                       $sort: {
                                _id: 1
                            } 
                    }
                    ]
                }
            }
        ])

       const totalDailyProgress = progressData[0]?.dailyProgress[0]?.totalDailyProgress || 0
       const totalWeeklyProgress= progressData[0]?.weeklyProgress[0]?.totalWeeklyProgress || 0
       const totalMonthlyProgress= progressData[0]?.monthlyProgress[0]?.totalMonthlyProgress || 0
       const dailyChart= progressData[0]?.chartData ||  []


      const streakData= await HabitProgress.aggregate( [
        {
            $match: {
                member: memberId,
                completed:true
            }
        },
        {
            $sort: {
                completedDate: 1
            }
        }
      ])

      const currentStreak= calculateCurrentStreak([...streakData].reverse())
      const longestStreak= calculateLongestStreak(streakData)

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
            dailyChart: dailyChart,
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

