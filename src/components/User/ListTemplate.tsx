
import { useEffect, useState } from "react"
import useFetch from "../../customHooks/useFetch"
import { useUser } from "../../UserContext"
import { BASE_URL_FOR_IMAGES, BASE_URL_OF_API } from "../../ApiVariables"
import { ListGroup } from "react-bootstrap"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { star, watchList } from "../../icons/icons"
import useArray from "../../customHooks/useArray"
import ToastComponent from "../../mini-components/ToastComponent"

const TOAST_MESSAGES = {
    "favorite add": {text: "Successfully added movie to favorite."},
    "favorite remove": {text: "Successfully removed movie from favorite."},
    "fail": {text: "Unable to perform action."},
    "watchlist add": {text: "Successfully added movie to watchlist."},
    "watchlist remove": {text: "Successfully removed movie from watchlist."},
}

const controller = new AbortController() 

const URL_TO_FETCH = {
   "favorite": {data: `/favorite`},
   "watchlist": {data: `/watchlist`},
}
const ListTemplate = ({dataToFetch}: {dataToFetch: string}): JSX.Element => {

    const user = useUser()
    const getDataMovies = useFetch(``,{},[]) 
    const getDataTvShows = useFetch(``,{},[]) 
    const dataMovieUserPreferenceBoolean = useArray([])
    const dataTvShowUserPreferenceBoolean = useArray([])
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState(TOAST_MESSAGES[dataToFetch + " remove"].text)


    useEffect(() => {
        if(user.fetchingUserDataFinished===true && user.logged){
            getDataMovies.changeUrl(BASE_URL_OF_API+`/account/${user.userInfo.id}/${URL_TO_FETCH[dataToFetch].data}/movies?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`)
            getDataTvShows.changeUrl(BASE_URL_OF_API+`/account/${user.userInfo.id}/${URL_TO_FETCH[dataToFetch].data}/tv?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`)
        }
    }, [user.fetchingUserDataFinished]);


    useEffect(() => {
        document.title = dataToFetch

        return () => {
            controller.abort()
        }
    }, []);

    useEffect(() => {
        if(getDataMovies.fetchDataStatus.value?.results){
            for(let i=0; i<getDataMovies.fetchDataStatus.value.results.length; i++){
                dataMovieUserPreferenceBoolean.push(true)
            }   
        }
        
    }, [getDataMovies.fetchDataStatus.value]);

    useEffect(() => {   
        if(getDataTvShows.fetchDataStatus.value?.results){

            for(let i=0; i<getDataTvShows.fetchDataStatus.value.results.length; i++){
                dataTvShowUserPreferenceBoolean.push(true)
            }   
        }
        
    }, [getDataTvShows.fetchDataStatus.value]);

    const changeUserPreference = (mediaType: string, id: number, currentPreferenceOfUser: boolean, index: number): void => {
        console.log(dataTvShowUserPreferenceBoolean)
        console.log(mediaType)
        let body: object
        if(dataToFetch==="favorite"){
            body = {
                media_type: mediaType? mediaType: "movie",
                media_id: id,
                favorite: !currentPreferenceOfUser
            }
        }
        else{
            body = {
                media_type: mediaType? mediaType: "movie",
                media_id: id,
                watchlist: !currentPreferenceOfUser
            }
        }
        
        const { signal } = controller
        
        fetch(BASE_URL_OF_API+`/account/${user.userInfo.id}/${URL_TO_FETCH[dataToFetch].data}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
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
                
                if(currentPreferenceOfUser){
                    setToastMessage(TOAST_MESSAGES[dataToFetch + " remove"].text)
                }
                else{
                    setToastMessage(TOAST_MESSAGES[dataToFetch + " add"].text)
                }
                
                if(mediaType==="movie"){
                    dataMovieUserPreferenceBoolean.update(!currentPreferenceOfUser, index)
                }
                else{
                    dataTvShowUserPreferenceBoolean.update(!currentPreferenceOfUser, index)
                }

            }
            setShowToast(true)

        })
        .catch(error=>{console.log(error)})
    
    }

    
    const Icon = (colorIcon: boolean): JSX.Element => {
        if(dataToFetch === "favorite"){
            return(
                <span>&nbsp;{star(colorIcon)}</span>
            )
        }
        return(
            <span>&nbsp;{watchList(colorIcon)}</span>
        )
    }

    const MoviesList = (): JSX.Element => {
        return(
            <div className="whole-height">
                {getDataMovies.fetchDataStatus.loading || user.fetchingUserDataFinished===false ?(
                    <LoadingCircle></LoadingCircle>
                ):(
                    <div>
                        <h1 className="center-text" style={{color: "white"}}>Your {dataToFetch} Movies:</h1>
                        {getDataMovies.fetchDataStatus.value===undefined ?
                        (
                            <ListGroup.Item >Something went wrong</ListGroup.Item>
                        ):(  
                            <div>
                                {getDataMovies.fetchDataStatus.value.total_results===0 ?(
                                    <ListGroup.Item>You dont have any favorite movie </ListGroup.Item>
                                ):(
                                    <div className="scrollable big  ">
                                        <ListGroup className="" as="ol"> 
                                            {getDataMovies.fetchDataStatus.value.results.map((value, index) => {
                                                return(
                                                    <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                                        <div className="ms-2 me-auto text-break inline-block">
                                                            <div className="fw-bold  ">
                                                                <img src={BASE_URL_FOR_IMAGES("w92") + value.poster_path}></img>
                                                                <a target="blank" href={'/search/movie?id=' + value.id}>{value.title}</a> 
                                                                <span onClick={() => changeUserPreference("movie", value.id, dataMovieUserPreferenceBoolean.array[index], index)} >
                                                                    {Icon(dataMovieUserPreferenceBoolean.array[index])}
                                                                </span>
                                                            </div>  
                                                        </div>
                                                    </ListGroup.Item>                               
                                                )
                                            })}    
                                        </ListGroup>
                                    </div>
                                )} 
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }


    const TvShowList = (): JSX.Element => {
        return(
            <div className="whole-height">
                {getDataTvShows.fetchDataStatus.loading || user.fetchingUserDataFinished===false ?
                    (
                        <LoadingCircle></LoadingCircle>
                    ):(
                        <div>
                            <h1 className="center-text" style={{color: "white"}}>Your {dataToFetch} Tv shows:</h1>
                            {getDataTvShows.fetchDataStatus.value===undefined ?
                            (
                                <ListGroup.Item >Something went wrong</ListGroup.Item>
                            ):(    
                                <div>    
                                    {getDataTvShows.fetchDataStatus.value.total_results===0 ?(
                                        <ListGroup.Item>You dont have any favorite movie </ListGroup.Item>
                                    ):(
                                        <div className="scrollable big  ">
                                            <ListGroup className="" as="ol"> 
                                            {getDataTvShows.fetchDataStatus.value.results.map((value, index) => {
                                                return(
                                                    <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                                        <div className="ms-2 me-auto text-break inline-block">
                                                            <div className="fw-bold  ">
                                                                <img src={BASE_URL_FOR_IMAGES("w92") + value.poster_path}></img>
                                                                <a target="blank" href={'/search/tvShow?id=' + value.id}>{value.name}</a> 
                                                                <span onClick={() => changeUserPreference("tv", value.id, dataTvShowUserPreferenceBoolean.array[index], index)}>
                                                                    {Icon(dataTvShowUserPreferenceBoolean.array[index])}
                                                                </span>
                                                            </div>  
                                                        </div>
                                                    </ListGroup.Item>                               
                                                )
                                            })}    
                                </ListGroup>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            
            )}
        </div>
    )

    }

    return(
        <div>
            <div>
                {getDataMovies.fetchDataStatus.loading && user.logged===false ?
                (
                    <div>
                        You must be logged in to see this information:
                    </div>
                ):(
                    <div className="container gap2">  
                        {MoviesList()}
                        {TvShowList()}
                    </div>
                )}
            </div>
            <ToastComponent toastMessage={toastMessage} setShowToast={setShowToast} showToast={showToast}></ToastComponent>
        </div>
    )
}

export default ListTemplate