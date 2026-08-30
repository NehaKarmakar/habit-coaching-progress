import Habit from "../models/habitModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import GroupEnrollment from "../models/groupEnrollmentModel.js";
import uploadFile from "../utilis/cloudinary.js";
import sendEmail from "../utilis/sendEmail.js";
export const addHabit = async (req, res) => {
    const {title, description,frequency,difficulty,groupName} = req.body
    try{
        const existingGroup = await Group.findOne( {createdBy: req.userId,groupName:groupName})
        if(!existingGroup){
            return res.status(404).json( {success: false, message: "Group not found"})
        }
        const existingHabit = await Habit.findOne( {title , group: existingGroup._id})
        if(existingHabit){
            return res.status(400).json( {success: false, message: "Habit already exists"})
        }

        const habit = new Habit( {title , description, frequency, difficulty, group: existingGroup._id , createdBy: req.userId})
        const habitRecord = await habit.save()
        await habitRecord.populate("group" , "groupName")
        await habitRecord.populate("createdBy" , "name email role")
        
        const enrollments = await GroupEnrollment.find({
    group: existingGroup._id
});

for (const enrollment of enrollments) {

    const member = await User.findById(enrollment.member);

    if (member) {
        await sendEmail(
            member.email,
            "New Habit Assigned",
            `Hi ${member.name},

A new habit has been assigned to your group.

Habit: ${habitRecord.title}
Description: ${habitRecord.description}
Frequency: ${habitRecord.frequency}
Difficulty: ${habitRecord.difficulty}

Please log in to the Habit Coaching platform to view the habit and track your progress.

Best regards,
Habit Coaching Team`
        );
    }
}
        
        return res.status(201).json( {success: true , message: "Habit successfully added to the group" , data: habitRecord})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const getAllHabits= async (req, res) => {
    try{
        const habits= await Habit.find().populate("createdBy", "name email role")
        if(!habits){
            res.status(404).json( {success: false, message: "Habits not found"})
        }

        return res.status(200).json( {success: true, message: "Habits successfully found", data: habits})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const getGroupHabits = async (req, res) => {
    const groupId = req.params.id
    try{
        const existingGroup = await Group.findOne( {_id: groupId})
        if(!existingGroup){
            return res.status(404).json( {success: false, message: "Group not exist"})
        }
        const habit = await Habit.find({group:groupId}).populate("group" , "groupName")
        if(!habit){
            return res.status(404).json( {success: false, message: "Habit not found"})
        }
        return res.status(200).json( {success: true, message: "Habits found successfully", data: habit})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const getGroupHabitById = async (req, res) => {
    const habitId= req.params.id
    
    try{
        const habit= await Habit.findOne( {_id: habitId}).populate("group" , "groupName")
        if(!habit){
            return res.status(404).json( {success: false, message: "Habit not found"})
        }
        return res.status(200).json( {success: true, message: "Habit found successfully" , data: habit})
        
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false , message: err.message})
    }
}

 export const updateGroupHabitById = async (req, res) => {
    const habitId = req.params.id
    const {title, description,frequency,difficulty,groupName} = req.body
    try{
        const existingGroup = await Group.findOne( {createdBy: req.userId,groupName:groupName})
        if(!existingGroup){
            return res.status(404).json( {success: false, message: "Group not found"})
        }
      const existingHabit = await Habit.findOne({createdBy: req.userId,_id:habitId})
      if(!existingHabit){
        return res.status(404).json( {success: false, message: "Habit not found"})
      }
      const habit = await Habit.findOneAndUpdate( {createdBy: req.userId,_id: habitId} ,
        {title , description, frequency, difficulty, group:existingGroup._id , createdBy: req.userId},
        {returnDocument: "after", runValidators: true}).populate("group", "groupName")
       return  res.status(200).json( {success: true, message: "Group Habit successfully got updated" , data: habit})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})

    }
 }

 export const deleteGroupHabitById = async (req, res) => {
    const habitId = req.params.id
    try{
        const existingHabit = await Habit.findOne( {createdBy: req.userId,_id: habitId})
        if(!existingHabit) {
            return res.status(404).json( {success: false , message: "Habit not found"})
        }
        const habit = await Habit.findOneAndDelete( {createdBy: req.userId,_id:habitId}).populate("group" , "groupName")
        return res.status(200).json( {success: true, message: "Habit got successfully deleted " , data: habit})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
 }

 export const uploadHabitResource= async (req, res) => {
     const habitId= req.params.id
     try{
        const habit= await Habit.findOne( {_id: habitId})
        if(!habit){
            return res.status(404).json( {success: false, message: "Habit not found"})
        }

        if(!req.file){
            return res.status(400).json( {success: false , message: "Please upload file"})
        }

        const result= await uploadFile(req.file.buffer)
        habit.resourceName= req.file.originalname
        habit.resourceUrl= result.secure_url
        console.log(result)
        console.log(result.secure_url)
        await habit.save()
        return res.status(200).json( {success: true, message: "File uploaded successfully", data: habit})
     }
     catch(err){
        console.log(err.message)
        return res.status(500).json({success: false, message: err.message})
     }
 }

 export const habitAggregate = async (req, res) => {
    try{
      const page= Number(req.query.page) || 1
      const limit= Number(req.query.limit) || 1
      const search= req.query.search || ""
      const sort = req.query.sort || "createdAt"
      const order= req.query.order || "desc"
      const orderData= order==="asc" ? 1:-1

      const pipeline= []
      
      if(search) {
        pipeline.push( {
        $match: {
            title: {
                $regex: search,
                $options: "i"
            }
        }
      })
      }

      pipeline.push( {
        $sort:{
            [sort] : orderData
        }
      })

      pipeline.push( 
        {$skip : (page-1) *limit},
        {$limit: limit}
      )

      pipeline.push( {
            $lookup: {
              from: "groups",
              localField: "group",
              foreignField: "_id",
              as: "GroupDetails"
            }
        })

       
    
     const habit = await Habit.aggregate(pipeline)
    const totalGroupHabits= search ? await Habit.countDocuments( {
        title: {
            $regex: search,
            $options: "i"
        }
    }): await Habit.countDocuments()
    // const totalGroupHabits = await Habit.countDocuments()
     const totalPages= Math.ceil(totalGroupHabits/limit)
     return res.status(200).json( {success: true, message: "Habit search,sort,pagination" , data: habit,totalGroupHabits: totalGroupHabits, currentPage: page, totalPages: totalPages})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
 }

 
    export const assignedHabitsAggregate = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const search = req.query.search || ""
        const sort = req.query.sort || "createdAt"
        const order = req.query.order || "desc"
        const orderData = order === "asc" ? 1 : -1

        // Find groups belonging to logged-in member
        const enrollments = await GroupEnrollment.find({
            member: req.userId
        }).select("group")

        const groupIds = enrollments.map(
            enrollment => enrollment.group
        )

        const pipeline = []

        // Only habits from member's groups
        pipeline.push({
            $match: {
                group: {
                    $in: groupIds
                }
            }
        })

        // Search
        if (search) {
            pipeline.push({
                $match: {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                }
            })
        }

        // Sort
        pipeline.push({
            $sort: {
                [sort]: orderData
            }
        })

        // Pagination
        pipeline.push(
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        )

        const habits = await Habit.aggregate(pipeline)

        // Count only this member's assigned habits
        const filter = {
    group: {
        $in: groupIds
    }
}

if (search) {
    filter.title = {
        $regex: search,
        $options: "i"
    }
}
const totalHabits = await Habit.countDocuments(filter)

        const totalPages = Math.ceil(totalHabits / limit)

        return res.status(200).json({
            success: true,
            message: "Assigned Habits Aggregate",
            data: habits,
            totalHabits: totalHabits,
            currentPage: page,
            totalPages: totalPages
        })
    }
    catch (err) {
        console.log(err.message)

        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}