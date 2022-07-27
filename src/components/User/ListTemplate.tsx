
import { useEffect } from "react"
import useFetch from "../../customHooks/useFetch"
import { useUser } from "../../UserContext"
import { BASE_URL_FOR_IMAGES, BASE_URL_OF_API } from "../../ApiVariables"
import { ListGroup } from "react-bootstrap"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { star, watchList } from "../../icons/icons"
import useArray from "../../customHooks/useArray"
import { useUpdateSnackbar } from "../../SnackBarContext"
import { MovieInfoBackend, TvShowInfoBackend } from "../../types/types"

const TOAST_MESSAGES = {
    "favorite add": {text: "Successfully added movie to favorite."},
    "favorite remove": {text: "Successfully removed movie from favorite."},
    "fail": {text: "Unable to perform action."},
    "watchlist add": {text: "Successfully added movie to watchlist."},
    "watchlist remove": {text: "Successfully removed movie from watchlist."},
}

 

const URL_TO_FETCH = {
   "favorite": {data: `favorite`},
   "watchlist": {data: `watchlist`},
}

const Icon = (colorIcon: boolean, dataToFetch: string): JSX.Element => {
    if(dataToFetch === "favorite"){
        return(
            <span>&nbsp;{star(colorIcon)}</span>
        )
    }
    return(
        <span>&nbsp;{watchList(colorIcon)}</span>
    )
}



const MoviesList = (
    {movies, changeUserPreference, dataToFetch, totalResults}:
    {
        movies: MovieInfoBackend[]|undefined, 
        changeUserPreference: (mediaType: string, id: number, currentPreferenceOfUser: boolean, index: number, updateBooleanData: (newValue: boolean, index: number) => void) => void,
        dataToFetch: string,
        totalResults: number
    }
): JSX.Element => {
    const dataMovieUserPreferenceBoolean = useArray<boolean>([])

    
    useEffect(() => {   
        if(movies!==undefined && movies){
            for(let i=0; i<movies.length; i++){
                dataMovieUserPreferenceBoolean.push(true)
            }   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movies])

    return(
        <div style={{display: "flex", flexDirection: "column"}} className="whole-height">
            <div className="list">
                <h1 className="center-text" style={{color: "white"}}>Your {dataToFetch} Movies:</h1>
            </div>
            {movies===undefined ?
            (
                <ListGroup.Item >Something went wrong</ListGroup.Item>
            ):(  
                <div className="list">
                    {totalResults===0 ?(
                        <ListGroup.Item>You dont have any favorite movie </ListGroup.Item>
                    ):(
                        <div className="scrollable big  ">
                            <ListGroup className="" as="ol"> 
                                {movies.map((value, index) => {
                                    return(
                                        <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto text-break inline-block">
                                                <div className="fw-bold  ">
                                                    <img alt={value.title} src={BASE_URL_FOR_IMAGES("w92") + value.poster_path}></img>
                                                    <a target="blank" href={'/search/movie/' + value.id}>{value.title}</a> 
                                                    <span onClick={() => 
                                                        changeUserPreference("movie", value.id, dataMovieUserPreferenceBoolean.array[index], index, dataMovieUserPreferenceBoolean.update)} >
                                                        {Icon(dataMovieUserPreferenceBoolean.array[index], dataToFetch)}
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
    )
}

const TvShowList = (
    {tvShows, changeUserPreference, dataToFetch, totalResults}:
    {
        tvShows: TvShowInfoBackend[]|undefined, 
        changeUserPreference: (mediaType: string, id: number, currentPreferenceOfUser: boolean, index: number, updateBooleanData: (newValue: boolean, index: number) => void) => void,
        dataToFetch: string,
        totalResults: number
    }
): JSX.Element => {
    
    const dataTvShowUserPreferenceBoolean = useArray<boolean>([])    

    useEffect(() => {
        if(tvShows!==undefined && tvShows){
            for(let i=0; i<tvShows.length; i++){
                dataTvShowUserPreferenceBoolean.push(true)
            }   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tvShows]);    

    return(
        <div style={{display: "flex", flexDirection: "column"}} className="whole-height">
            <div className="list">
                <h1 className="center-text" style={{color: "white"}}>Your {dataToFetch} Tv shows:</h1>
            </div>
            {tvShows===undefined ?
            (
                <ListGroup.Item >Something went wrong</ListGroup.Item>
            ):(    
                <div className="list">    
                    {totalResults===0 ?(
                        <ListGroup.Item>You dont have any favorite movie </ListGroup.Item>
                    ):(
                        <div className="scrollable big  ">
                            <ListGroup className="" as="ol"> 
                            {tvShows.map((value, index) => {
                                return(
                                    <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto text-break inline-block">
                                            <div className="fw-bold">
                                                <img alt={value.name} src={BASE_URL_FOR_IMAGES("w92") + value.poster_path}></img>
                                                <a target="blank" href={'/search/tvShow/' + value.id}>{value.name}</a> 
                                                <span onClick={() => 
                                                    changeUserPreference("tv", value.id, dataTvShowUserPreferenceBoolean.array[index], 
                                                        index, dataTvShowUserPreferenceBoolean.update)}>
                                                    {Icon(dataTvShowUserPreferenceBoolean.array[index], dataToFetch)}
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
    )
}

const ListTemplate = ({dataToFetch}: {dataToFetch: string}): JSX.Element => {
    const user = useUser()
    const getDataMovies = useFetch(``,{},[]) 
    const getDataTvShows = useFetch(``,{},[]) 

    const updateSnackBar = useUpdateSnackbar()

    const controller = new AbortController()

    useEffect(() => {
        if(user.fetchingUserDataFinished===true && user.logged){
            getDataMovies.changeUrl({
                newUrl: `${BASE_URL_OF_API}/account/${user.userInfo.id}/${URL_TO_FETCH[dataToFetch].data}/movies?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`})
            getDataTvShows.changeUrl({newUrl: 
                BASE_URL_OF_API+`/account/${user.userInfo.id}/${URL_TO_FETCH[dataToFetch].data}/tv?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.fetchingUserDataFinished]);


    useEffect(() => {
        document.title = dataToFetch

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataToFetch])

    const changeUserPreference = (mediaType: string, id: number, currentPreferenceOfUser: boolean, 
        index: number, updateBooleanData: (newValue: boolean, index: number) => void): void => {

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
            if(response.success === false) updateSnackBar.addSnackBar({snackbarText: TOAST_MESSAGES["fail"].text, severity: "success"})
            else{
                if(currentPreferenceOfUser) updateSnackBar.addSnackBar({snackbarText: TOAST_MESSAGES[dataToFetch + " remove"].text, severity: "success"})
                else updateSnackBar.addSnackBar({snackbarText: TOAST_MESSAGES[dataToFetch + " add"].text, severity: "success"})
                updateBooleanData(!currentPreferenceOfUser, index)
            }
        })
        .catch(error=>{console.log(error)})
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
                        {getDataTvShows.fetchDataStatus.loading || user.fetchingUserDataFinished===false ?
                            (
                                <LoadingCircle></LoadingCircle>
                            ):(
                                <TvShowList tvShows={getDataTvShows.fetchDataStatus.value.results} totalResults={getDataTvShows.fetchDataStatus.value.total_results} 
                                    changeUserPreference={changeUserPreference} dataToFetch={dataToFetch}/>
                            )
                        }
                        {getDataMovies.fetchDataStatus.loading || user.fetchingUserDataFinished===false ?
                            (
                                <LoadingCircle></LoadingCircle>
                            ):(
                                <MoviesList movies={getDataMovies.fetchDataStatus.value.results} totalResults={getDataMovies.fetchDataStatus.value.total_results} 
                                    changeUserPreference={changeUserPreference} dataToFetch={dataToFetch} />
                            )
                        }
                    </div>
                )}
            </div>
        </div>

    )
}

export default ListTemplate