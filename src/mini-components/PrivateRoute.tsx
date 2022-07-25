import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext";

export const PrivateRoute = ({ children}) => {
    const user = useUser()

    const isAuthenticated = user.logged || !user.fetchingUserDataFinished
        
    if (isAuthenticated ) {
      return children
    }
      
    return <Navigate to="/" />
}