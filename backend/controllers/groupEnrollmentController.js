import GroupEnrollment from "../models/groupEnrollmentModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";

export const addMember = async (req, res) =>{
    const {group, member } = req.body
    try{
        const existingGroup = await Group.findOne({_id:group})
        if(!existingGroup){
            return res.status(404).json( {success: false , message: "Group not exists"})
        }

        const existingMember = await User.findOne( {_id:member})
        if(!existingMember){
            return res.status(404).json( {success: false, message: "Member not  exists"})
        }

        const alreadyGroupEnrollement = await GroupEnrollment.findOne( {group, member})
        if(alreadyGroupEnrollement){
            return res.status(400).json( {success: false , messsage: "Already in the group"})
        }

        const groupEnrollment = new GroupEnrollment( {group, member})
        const groupEnrollmentRecord= await groupEnrollment.save()
        await groupEnrollmentRecord.populate("group" , "groupName")
        await groupEnrollmentRecord.populate("member", "name email")
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
     const groupEnrollment = await GroupEnrollment.find( {group:groupId}) .populate("member" ,"name email")
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
        const groupEnrollment = await GroupEnrollment.find( {member: memberId}).populate("group" , "groupName")
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
      const groupEnrollment = await GroupEnrollment.findOneAndDelete({member: memberId}).populate("group" , "groupName").populate("member" ,"name email")
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
    try{
    const page= Number(req.query.page )|| 1
    const limit=Number( req.query.limit) || 1
    const search = req.query.search || "" 
    const sort= req.query.sort ||"createdAt"
    const order= req.query.order || "desc"
    const orderData = order=== "asc" ? 1: -1

    const pipeline= [] 
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
        $count: total
    })

    const countResult= await GroupEnrollment.aggregate(countPipeline)
    //No search → counts all enrollments
   //Search used → counts only matching enrollments ,No matching results → returns 0

    const totalGroupEnrollments =  countResult[0]?.total || 0;
    const totalPages= Math.ceil(totalGroupEnrollments/limit)
    return res.status(200).json( {success: true , message: "Group enrollment searching sorting and pagination",data: groupEnrollment,totalGroupEnrollments: totalGroupEnrollments, currentPage: page, totalPages: totalPages,})
  }

catch(err){
 console.log(err.message)
 return res.status(500).json( {success: false , message: err.message})
}
}