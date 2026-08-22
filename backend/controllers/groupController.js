
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";

export const addGroup = async (req, res) => {
    const {groupName,description} = req. body
    const existingGroupName= await Group.findOne( {groupName})
    if(existingGroupName) {
        return res.status(400).json( {success: false, message: "Group Name already exist"})
    }

    try{
        const group= new Group ( {groupName: groupName, description: description, createdBy: req.userId})
        const groupRecord= await group.save()
        await groupRecord.populate("createdBy" , "name email role")
        return res.status(201).json( {success: true, message: "Group successfully created", data: groupRecord})
        
    }

    catch(err) {
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }

}

export const listGroups= async(req, res) => {
    try{
        
    const group= await Group.find( ).populate("createdBy" ," name email role")
     
     if(!group){
        return res.status(404).json( {success:false , message: "Groups not found"})
     }
     return res.status(200).json( {success: true, message: "Groups found successfully", data: group})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const groupById = async (req, res) => {
    const id= req.params.id
    try{
        const group= await Group.findOne( { _id: id}).populate("createdBy", "name email role")
        if(!group){
            return res.status(404).json( {success: false, message: "group not found" })
        }
        return res.status(200).json( {success: true, message: "group found successfully" , data: group})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const updateGroupById = async (req, res) => {
    const id= req.params.id
    const {groupName, description} = req.body
    
    try{
       const group = await Group.findOneAndUpdate( 
        {createdBy: req.userId , _id: id} , 
        {groupName, description}, 
        {returnDocument: "after" , runValidators: true}).populate("createdBy" ,"name email role")

        if(!group){
        return res.status(404).json( {success: false, message: "Group Name not found"})
        }

        return res.status(200).json( {success: true, message: "Group Updated Successfully" , data: group})

    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export const deleteGroupById = async (req, res) => {
    const id= req.params.id
    try{
       const group = await Group.findOneAndDelete( {createdBy: req.userId, _id: id}).populate("createdBy" , "name email role")
       if(!group){
        return res.status(404).json( {success: false, message: "Group not found"})
       }
       return res.status(200).json( {success: true, message: "Group deleted successfully" , data: group})
    }
    catch(err){
        console.log(err.message)
        return res.status(500).json( {success: false, message: err.message})
    }
}

export  const searchingSortingPagination = async (req, res) => {
 try{

    const search= req.query.search || ""
    const page= Number(req.query.page) || 1
    const limit= Number(req.query.limit )|| 1
    const sort= req.query.sort || "createdAt"
    const order= req.query.order || "desc"
    const orderData= order=== "asc"? 1:-1

    const pipeline = []

   if(search){
     pipeline.push( {

        $match: {
            groupName: {
                $regex: search,
                $options: "i"
            }
        }
    })
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

    pipeline.push( {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "User details"
            }
        })

    const group = await Group.aggregate(pipeline)
    const totalGroups = search
    ? await Group.countDocuments({
        groupName: {
            $regex: search,
            $options: "i"
        }
    })
    : await Group.countDocuments();
  
    const totalPages= Math.ceil( totalGroups/limit)

    return res.status(200).json( {success: true , message: "Searching , sorting and pagination" ,data: group,
         totalGroups: totalGroups, currentPage: page,totalPages: totalPages})

 }

 catch(err)  {
    console.log(err.message)
    return res.status(500).json( {success: false, message: err.message})
 }
}