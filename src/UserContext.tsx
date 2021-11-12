import  {useState, createContext, useContext} from "react";
import { UserInfo } from "./types/types";
import {useEffect} from "react"
import { BASE_URL_OF_API } from "./ApiVariables";

type UserContextProps = {    
    logged: boolean; 
    sessionId: string; 
    userInfo: UserInfo;
    fetchingUserDataFinished: boolean; 
}

type UserUpdateContextProps = {    
    setLoggedUser: (sessionId: string, logged: boolean) => void
    setLoggedUserInfo: (userInfo: UserInfo) => void
    fetchAllData: () => void
}

const UserContext = createContext({} as UserContextProps)
const UserUpdate = createContext({} as UserUpdateContextProps)


export function useUser(){
    return useContext(UserContext)
}

export function useUserUpdate(){
    return useContext(UserUpdate)
}

const controller = new AbortController()
const UserProvider = ({ children }) => {
    const[sessionId, setSessionId] = useState('')
    const[logged, setLogged] = useState(false)
    const[userInfo, setUserInfo] = useState<UserInfo>()
    const[fetchingUserDataFinished, setFetchingUserDataFinished] = useState(false)


    const setLoggedUser = (sessionId: string, logged: boolean ): void =>{
        setSessionId(sessionId)
        setLogged(logged)
    }

    const setLoggedUserInfo = (userInfo: UserInfo): void => {
        setUserInfo(userInfo)
    }

    const fetchAllData = (): void => {

        if(sessionStorage.getItem("sessionId")){
            if(sessionStorage.getItem("userData")){
                setLogged(true)
                setSessionId(sessionStorage.getItem("sessionId"))
                setUserInfo(JSON.parse(sessionStorage.getItem("userData")))
            }
            else{
                const { signal } = controller
                fetch(BASE_URL_OF_API+`/account?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${sessionStorage.getItem("sessionId")}`,{
                    method: "GET",
                    signal,
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    if(response.success === false){
                        sessionStorage.removeItem("sessionId")
                        setLogged(false)
                        setSessionId("")
                        return 
                    }
                    setLogged(true)
                    setSessionId(sessionStorage.getItem("sessionId"))
                    let userInfo: UserInfo = response
                    setUserInfo(userInfo) 
                    sessionStorage.setItem("userData", JSON.stringify(userInfo))

                })
                .catch(error=>{console.log(error)})
            }
            
        }
        setFetchingUserDataFinished(true)
    }



    useEffect(() => {
        return () => {
            controller.abort()
        }
    }, []);

    
    return(
        <UserContext.Provider value={{logged, sessionId, userInfo, fetchingUserDataFinished}}>
            <UserUpdate.Provider value={{setLoggedUser, setLoggedUserInfo, fetchAllData}}>
                {children}   
            </UserUpdate.Provider>
        </UserContext.Provider>
    )
}

export default UserProvider