const reducer= (state, action) => {
    switch(action.type){
        case "LOGIN":{
            return {...state, isLoggedIn: true, user: action.payload}
        }
        case "LOGOUT": {
            return {...state, isLoggedIn: false, user: null}
        }
       
      case "UPDATE_PROFILE":
       return {
        ...state,
        user: action.payload
       }

       case "DELETE_ACCOUNT": {
        return {...state, isLoggedIn:false, user:null}
       }
        default: {
            throw new Error("Invalid action type")
        }

    }
}

export default reducer
