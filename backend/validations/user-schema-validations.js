
import User from "../models/userModel.js"
export const userRegisterSchema = {
    name: {
       exists: {
        errorMessage: "name is required"
       }
    },
    email: {
        exists: {
            errorMessage: "email ie required"
        },
        notEmpty: {
            errorMessage: "email cannot be empty"
        },
        isEmail: {
            errorMessage: "email should be in valid format"
        },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async function (value) {
                    try{
                      const user= await  User.findOne( {email:value}) 
                    if(user){
                        throw new Error("email is already taken")
                    }
                
                    }
                   catch(err){
                    throw new Error(err.message);
                   }
                   return true
                }
            
        }
    },

    password: {
        exists: {
            errorMessage: "password is required"
        },
        notEmpty: {
            errorMessage: "password cannot be empty"
        },
        isStrongPassword: {
         
            options: {
                minLength: 8,
                minNumber: 1,
                minUpperCase: 1,
                minLowerCase: 1,
                minSymbol: 1,
                trim: true
            },
            errorMessage: 'password must contain atleast 1 lowerCase, 1 upperCase, 1 Number, 1 symbol, and it must be minimum 8 charaters long'
         }
        


    }
}

export const userLoginSchema = {
    
    email: {
        exists: {
            errorMessage: "email ie required"
        },
        notEmpty: {
            errorMessage: "email cannot be empty"
        },
        isEmail: {
            errorMessage: "email should be in valid format"
        },
        trim: true,
        normalizeEmail: true,
        
    },

    password: {
        exists: {
            errorMessage: "password is required"
        },
        notEmpty: {
            errorMessage: "password cannot be empty"
        },
        isStrongPassword: {
         custom: {
            options: {
                minLength: 8,
                minNumber: 1,
                minUpperCase: 1,
                minLowerCase: 1,
                minSymbol: 1,
                trim: true
            },
            errorMessage: 'password must contain atleast 1 lowerCase, 1 upperCase, 1 Number, 1 symbol, and it must be minimum 8 charaters long'
         }
        }


    }
}
