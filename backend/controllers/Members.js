import User from "../models/userModel.js"
export const members= async (req, res) => {
  try{
    const page= Number(req.query.page) || 1
    const limit= Number(req.query.limit) || 5
    const search= req.query.search || ""
    const sort= req.query.sort || "createdAt"
    const order= req.query.order || "desc"
    const orderData= order==="asc" ? 1:-1
    const pipeline= [] 

    pipeline.push( {
        $match: {
            role:"member"
        }
    })
    if(search) {
        pipeline.push( {
            $match: {
                name: {
                    $regex: search,
                    $options: "i"
                }
            }
        })
    }

    pipeline.push( {
        $sort: {
            [sort]: orderData
        }
    })

    pipeline.push( 
        {$skip: (page-1) *limit},
        {$limit: limit}
    )

    const users= await User.aggregate(pipeline)
    const totalUsers= search ? await User.countDocuments( {
        role: "member",
        name: {
            $regex: search,
            $options: "i"
        }
    }) : await User.countDocuments( {
        role: "member"
    })
    const totalPages= Math.ceil(totalUsers/limit)
    return res.status(200).json( {success: true, message: "Members Aggreagte", data: users, totalPages: totalPages, currentPage: page})

  }
  catch(err){
    console.log(err.message)
    return res.status(500).json( {success: false, message: err.message})
  }
}