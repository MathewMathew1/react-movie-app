

import { useEffect, useState } from "react"
import queryString from "query-string"
import { BASE_URL_OF_API } from "../../ApiVariables";
import { Spinner } from "react-bootstrap";
import { useUserUpdate } from "../../UserContext";

const controller = new AbortController() 

const LoginPage = ({location}): JSX.Element => {
    
    const [error, setError] = useState("")
    const userUpdate = useUserUpdate()
        
    useEffect(() => {
        document.title = "Login"
        let filter = queryString.parse(location.search)
        if(filter["approved"]==="true"){
            
            const { signal } = controller

            console.log(`/authentication/session/new?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&request_token=${filter["request_token"]}`)
            fetch(BASE_URL_OF_API+`/authentication/session/new?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&request_token=${filter["request_token"]}`,{
                    method: "POST",

                    signal,
            })
            .then(response => response.json())
            .then(response => {
            console.log(response)  
            
            if(response.success === false){
                setError("Unable to Login")
                return
            }
            userUpdate.setLoggedUser(response.session_id, true)
            sessionStorage.setItem("sessionId", response.session_id)
            window.location.href = "/"
            })
            .catch(error=>{console.log(error)})   
        }
        else{
            setError("Invalid way of logging, try to use login button in navbar")
        }
    }, []);


    return(
        <div>
            {error === "" ?
                (
                    <div style={{backgroundColor: "white", textAlign: "center"}}>
                        Authenticating: <Spinner animation="grow" />
                    </div>
                ):(
                    <div className="alert" >{error}</div>
                )
            }
            
        </div>
    )
}

export default LoginPage