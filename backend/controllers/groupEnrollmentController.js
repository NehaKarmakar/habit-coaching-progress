import mongoose from "mongoose";
import GroupEnrollment from "../models/groupEnrollmentModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utilis/sendEmail.js";
export const addMember = async (req, res) =>{
    const {group, memberName} = req.body
    try{
        const existingGroup = await Group.findOne({_id:group})
        if(!existingGroup){
            return res.status(404).json( {success: false , message: "Group not exists"})
        }

        const existingMember = await User.findOne( {name:memberName})
        if(!existingMember){
            return res.status(404).json( {success: false, message: "Member not  exists"})
        }

        const alreadyGroupEnrollement = await GroupEnrollment.findOne( {group, member:existingMember._id})
        if(alreadyGroupEnrollement){
            return res.status(400).json( {success: false , message: "Already in the group"})
        }

        const groupEnrollment = new GroupEnrollment( {group, member:existingMember._id})
        const groupEnrollmentRecord= await groupEnrollment.save()
        await groupEnrollmentRecord.populate("group" , "groupName")
        await groupEnrollmentRecord.populate("member", "name email phone role")
        await sendEmail(
    existingMember.email,
    "You have been added to a group",
    `Hi ${existingMember.name},

You have been added to the group "${existingGroup.groupName}".

You can now access the group and start your habit coaching activities.

Best regards,
Habit Coaching Team`
);
        return res.status(201).json( {success: true, message: "Member successfully added to the group", data: groupEnrollmentRecord})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false , message: err.message})
    }
}

export const groupMembers = async (req, res) => {
    const groupId= req.params.id
    try{
     const groupEnrollment = await GroupEnrollment.find( {group:groupId}) .populate("member" ,"name email phone role")
     if(!groupEnrollment){
        return res.status(404).json({success: false, message: "Members not found"})
     }
     return res.status(200).json( {success: true, message: "Members successfully found" , data: groupEnrollment})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const memberGroups = async (req, res) => {
    const memberId= req.params.id
    try{
        
        const groupEnrollment = await GroupEnrollment.find( {member: memberId}).populate("group" , "groupName description")
        if(!groupEnrollment){
            return res.status(404).json( {success: false , message: "Groups not found"})
        }
        
        return res.status(200).json( {success: true , message: "Groups successfully found" , data: groupEnrollment})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const deleteMember = async (req, res) => {
    const memberId = req.params.id
    try{
      const groupEnrollment = await GroupEnrollment.findOneAndDelete({member: memberId}).populate("group" , "groupName").populate("member" ,"name email phone email")
      if(!groupEnrollment){
        return res.status(404).json( {success: false , message: "Member not found"})
      }
      return res.status(200).json( {success: true , message:"Member deleted successfully from the group" , data: groupEnrollment})
    }
    catch(err){
       console.log(err.message)
       return res.status(500).json( {succcess: false , message: err.message})
    }
}

export const groupEnrollmentAggregate = async (req, res) => {
    const groupId = req.query.groupId;
    try{
    const page= Number(req.query.page )|| 1
    const limit=Number( req.query.limit) || 1
    const search = req.query.search || "" 
    const sort= req.query.sort ||"createdAt"
    const order= req.query.order || "desc"
    const orderData = order=== "asc" ? 1: -1

    const pipeline= [] 
    pipeline.push({
    $match: {
        group: new mongoose.Types.ObjectId(req.params.id)
    }
});
    pipeline.push({
    $lookup: {
        from: "users",
        localField: "member",
        foreignField: "_id",
        as: "memberDetails"
    }
    
  
});
    if(search){
        pipeline.push( {
        $match: {
            "memberDetails.name":{
            $regex: search,
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
        {$skip : (page-1) * limit},
        {$limit: limit}
    )

    const groupEnrollment = await GroupEnrollment.aggregate(pipeline)

    const countPipeline = []
     countPipeline.push({
    $match: {
        group: new mongoose.Types.ObjectId(req.params.id)
    }
});
    countPipeline.push( {
        $lookup: {
            from: "users",
            localField: "member",
            foreignField: "_id",
            as: "memberDetails"
            

        }
        
  

    })

    if(search){
        countPipeline.push( {
            $match: {
                "memberDetails.name": {
                    $regex: search,
                    $options: "i"
                }
            }
        })
    }

    countPipeline.push( {
        $count: "total"
    })

    const countResult= await GroupEnrollment.aggregate(countPipeline)
    //No search → counts all enrollments
   //Search used → counts only matching enrollments ,No matching results → returns 0

    const totalGroupEnrollments =  countResult[0]?.total || 0;
    const totalPages= Math.max(1,Math.ceil(totalGroupEnrollments/limit))
    return res.status(200).json( {success: true , message: "Group enrollment searching sorting and pagination",data: groupEnrollment,totalGroupEnrollments: totalGroupEnrollments, currentPage: page, totalPages: totalPages,})
  }

catch(err){
 console.log(err.message)
 return res.status(500).json( {success: false , message: err.message})
}
}

export const memberGroupsAggregate = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const search = req.query.search || ""
        const sort = req.query.sort || "createdAt"
        const order = req.query.order || "desc"
        const orderData = order === "asc" ? 1 : -1

        const pipeline = []

        // Get groups belonging to this member
        pipeline.push({
            $match: {
                member: new mongoose.Types.ObjectId(req.userId)
            }
        })

        // Get group details
        pipeline.push({
            $lookup: {
                from: "groups",
                localField: "group",
                foreignField: "_id",
                as: "groupDetails"
            }
        })

        // Search by group name
        if (search) {
            pipeline.push({
                $match: {
                    "groupDetails.groupName": {
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
            { $skip: (page - 1) * limit },
            { $limit: limit }
        )

        // Result
        pipeline.push({
            $project: {
                member: 1,
                group: 1,
                groupDetails: 1,
                createdAt: 1,
                joinedAt: "$createdAt"
            }
        })

        const memberGroups = await GroupEnrollment.aggregate(pipeline)

        // Count
        const countPipeline = []

        countPipeline.push({
            $match: {
                member: new mongoose.Types.ObjectId(req.userId)
            }
        })

        countPipeline.push({
            $lookup: {
                from: "groups",
                localField: "group",
                foreignField: "_id",
                as: "groupDetails"
            }
        })

        if (search) {
            countPipeline.push({
                $match: {
                    "groupDetails.groupName": {
                        $regex: search,
                        $options: "i"
                    }
                }
            })
        }

        countPipeline.push({
            $count: "total"
        })

        const countResult = await GroupEnrollment.aggregate(countPipeline)

        const totalGroupEnrollments = countResult[0]?.total || 0
        const totalPages = Math.max(1,Math.ceil(totalGroupEnrollments / limit))

        return res.status(200).json({
            success: true,
            message: "Member groups searching, sorting and pagination",
            data: memberGroups,
            totalGroupEnrollments,
            currentPage: page,
            totalPages
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