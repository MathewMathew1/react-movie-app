

import { useEffect, useState } from "react"
import { BASE_URL_OF_API } from "../../ApiVariables";
import { Spinner } from "react-bootstrap";
import { useUserUpdate } from "../../UserContext";
import { useSearchParams } from "react-router-dom";

const LoginPage = (): JSX.Element => {
    const [error, setError] = useState("")
    const userUpdate = useUserUpdate()
    const [searchParams] = useSearchParams()
    const controller = new AbortController() 

    useEffect(() => {
        const authenticate = (): void => {
            document.title = "Login"
            let searchParamsObject = Object.fromEntries([...searchParams])
            let approved = searchParamsObject['approved']
            let token = searchParamsObject['request_token']

            if(approved){
                
                const { signal } = controller

                fetch(BASE_URL_OF_API+`/authentication/session/new?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&request_token=${token}`,{
                        method: "POST",
                        signal,
                })
                .then(response => response.json())
                .then(response => {
                
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
        }

        authenticate()

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div className="centered">
            {error === "" ?
                (
                    <div style={{color: "white", textAlign: "center"}}>
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