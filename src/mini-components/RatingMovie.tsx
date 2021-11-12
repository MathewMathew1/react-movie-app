

import { useState, useEffect } from "react"
import { list, star, watchList, numberI } from "../icons/icons"
import { Dropdown } from "react-bootstrap"
import { BASE_URL_OF_API } from "../ApiVariables"
import { useUser } from "../UserContext"
import ToastComponent from "./ToastComponent"

const controller = new AbortController() 


const TOAST_MESSAGES = {
    "Made favorite": {text: "Successfully added movie to favorite."},
    "Made unfavorite": {text: "Successfully removed movie from favorite."},
    "fail": {text: "Unable to perform action."},
    "Added to watchlist": {text: "Successfully added movie to watchlist."},
    "Removed from watchlist": {text: "Successfully removed movie from watchlist."},
    "rated": {text: "Successfully rated movie"}
}

const RatingMovie  = ({id, mediaType}:{id: number, mediaType: string}): JSX.Element => {

    const [isItFavoriteMovie, setIsItFavoriteMovie] = useState(false)
    const [isMovieOnWatchList, setIsMovieOnWatchList] = useState(false)
    const [userDataOnMovieFetched, setUserDataOnMovieFetched] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState(TOAST_MESSAGES["Made favorite"].text)
    const [showRating, setShowRating] = useState(false)
    const [wasThisFilmRated, setWasThisFilmRated] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [userRatingOnHover, setUserRatingOnHover] = useState(0)
    const user = useUser()



    const makeMovieFavorite = () => {

        const body = {
            media_type: mediaType? mediaType: "movie",
            media_id: id,
            favorite: !isItFavoriteMovie
        }

        const { signal } = controller
        fetch(BASE_URL_OF_API+`/account/${user.userInfo.id}/favorite?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(body),
            signal,
        })
        .then(response => response.json())
        .then(response => {
            if(response.success === false){
                setToastMessage(TOAST_MESSAGES["fail"].text)
            }
            else{
                if(isItFavoriteMovie){
                    setToastMessage(TOAST_MESSAGES["Made unfavorite"].text)
                    
                }
                else{
                    setToastMessage(TOAST_MESSAGES["Made favorite"].text)
                }
                setIsItFavoriteMovie(!isItFavoriteMovie)
            }
            setShowToast(true)
        })
        .catch(error=>{console.log(error)})
    
    }

    const fetchUserDataOnMovie = (): void => {

        if(userDataOnMovieFetched) return
        
        const { signal } = controller
        setUserDataOnMovieFetched(true)
        let media: string = mediaType? mediaType: "movie"
        fetch(BASE_URL_OF_API+`/${media}/${id}/account_states?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${sessionStorage.getItem("sessionId")}`,{
            method: "GET",
            signal,
        })
        .then(response => response.json())
        .then(response => {
            if(response.rated === false){
                setWasThisFilmRated(false)
            }
            else{
                setWasThisFilmRated(true)
                setUserRating(response.rated.value)
            }
            console.log(response)
            setIsItFavoriteMovie(response.favorite)
            setIsMovieOnWatchList(response.watchlist)
        })
        .catch(error=>{console.log(error)})
    }


    useEffect(() => {
        setUserRatingOnHover(userRating)
    }, [userRating]);

    const addToWatchList = () => {
        
    
        const body = {
            media_type: mediaType? mediaType: "movie",
            media_id: id,
            watchlist: !isMovieOnWatchList
        }

        const { signal } = controller
        fetch(BASE_URL_OF_API+`/account/${user.userInfo.id}/watchlist?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(body),
            signal,
        })
        .then(response => response.json())
        .then(response => {

            if(response.success === false){
                setToastMessage(TOAST_MESSAGES["fail"].text)
            }
            else{
                if(isMovieOnWatchList){
                    setToastMessage(TOAST_MESSAGES["Removed from watchlist"].text)
                    
                }
                else{
                    setToastMessage(TOAST_MESSAGES["Added to watchlist"].text)
                }
                setIsMovieOnWatchList(!isMovieOnWatchList)
            }
            setShowToast(true)
        })
        .catch(error=>{console.log(error)})
    
    }

    const rateMovie = (value: number): void => {
        
        let media = mediaType? mediaType: "movie"
        const body = {
            "value": value
        }

        const { signal } = controller
        fetch(BASE_URL_OF_API+`/${media}/${id}/rating?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(body),
            signal,
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if(response.success === false){
                setToastMessage(TOAST_MESSAGES["fail"].text)
            }
            else{
                setToastMessage(TOAST_MESSAGES["rated"].text)
                setWasThisFilmRated(true)
                setUserRating(value)
            }
            setShowToast(true)
        })
        .catch(error=>{console.log(error)})
    
    }

    const starForRating = (index: number): JSX.Element => {
        let colorStar: boolean =  index + 1 <= userRatingOnHover? true: false

        return(
            <span onMouseLeave={() => setUserRatingOnHover(userRating)} onMouseOver={() => setUserRatingOnHover(index+1)} onClick={() => rateMovie(index+1)}>{star(colorStar)}</span>
        )
    }

    useEffect(() => {
        return () => {
          controller.abort()
        }
    }, []);

    return (
        <div>
            { user.logged ? (
                <div className="right-corner">
                    <div >
                        <div onClick={() => {setShowDropDown(!showDropDown)
                            fetchUserDataOnMovie(); setShowRating(false)}} className="circle-list">
                            {list()}
                            
                        </div>
                        {showDropDown ?(
                            <div className="dropdown-in-preview" >
                                    <Dropdown.Item eventKey="1" onClick={() => makeMovieFavorite()}>{star(isItFavoriteMovie)} 
                                        &nbsp;Favorite
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => addToWatchList()}>{watchList(isMovieOnWatchList)} 
                                        &nbsp;Watchlist
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setShowRating(!showRating)} eventKey="3">{numberI()}
                                        &nbsp; Rate

                                    </Dropdown.Item>
                            </div>
                        ):null}
                        </div>
                        {showRating ?(
                            <div style={{backgroundColor: "white"}} >
                                <Dropdown.Item>
                                    {Array.from(Array(10), (e, i) => {
                                        return(
                                            <span key={i}>{starForRating(i)}</span>
                                        )
                                    })}
                                </Dropdown.Item>
                            </div>
                        ):null}
                    </div>
                ):null}
             <ToastComponent toastMessage={toastMessage} setShowToast={setShowToast} showToast={showToast}></ToastComponent>
        </div>
    )      
}


export default RatingMovie