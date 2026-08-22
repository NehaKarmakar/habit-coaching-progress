const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if(!permittedRoles.includes(req.role)){
            return res.status(401).json({message:'you do not have permission to access this route'})
        }
        next()
        
    }
    
}

export default authorizeUser
