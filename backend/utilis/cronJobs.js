import cron from "node-cron"
import User from "../models/userModel.js"
import GroupEnrollment from "../models/groupEnrollmentModel.js"
import Habit from "../models/habitModel.js"
import sendEmail from "../utilis/sendEmail.js"
export const startCronJobs = () => {
    cron.schedule("* * * * *" , async () => {
        try{
            const members = await User.find( {role: "member"})
           
            for(let member of members){
                
                const enrollmentMembers = await GroupEnrollment.find( {member: member._id})
                
                    const groupId = enrollmentMembers.map((ele) => {
                        return ele.group
                    })
                    const assignedHabits = await  Habit.find( {group: {$in: groupId}})

                    console.log("\n----------------------")
                    console.log("Member:", member.name)
                    console.log("Email:", member.email)
                    console.log("Groups:", groupId.length)
                    console.log("Habits:", assignedHabits.length)
                    
                    if(assignedHabits.length===0){
                        console.log(" NO REMINDER:", member.name)
                        continue;
              
                    }
                
                    console.log("SENDING REMINDER:", member.name)
                    await sendEmail(
                         member.email,
                    "Daily Habit Reminder",
                    `Hi ${member.name},

Don't forget to complete your assigned habits today.

You have ${assignedHabits.length} assigned habit(s) to work on.

Keep going and stay consistent!

Best regards,
Habit Coaching Team`

                    )
                    console.log("Remainder email sent")
                    
                }
            }
        
        catch(err){
            console.log("Cron Error", err.message)
        }
    })
}