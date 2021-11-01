import { moviePreviewType, useFetchSettingType } from "../../types/types"
import MoviePreview from "../Movie/MoviePreview"
import Hero from "./Hero"
import useFetch from "../../customHooks/useFetch"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { BASE_URL_OF_API, BASE_URL_FOR_IMAGES } from "../../ApiVariables"

const USE_FETCH_SETTINGS: useFetchSettingType[] = [
    
    {
        url: BASE_URL_OF_API + `/trending/movie/week?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'trendingMoviesWeek',
    },
    
    {
        url: BASE_URL_OF_API + `/trending/movie/day?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'trendingMoviesDay',
    },

    {
        url: BASE_URL_OF_API + `/movie/top_rated?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'popularMoviesAllTime',
    },
    {
        url: BASE_URL_OF_API + `/movie/now_playing?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'nowPLaying',
    },
    {
        url: BASE_URL_OF_API + `/movie/upcoming?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'Upcoming',
    },
    {
        url: BASE_URL_OF_API + `/tv/top_rated?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'tvShowsTopRated',
    },
  
    {
        url: BASE_URL_OF_API + `/tv/popular?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'tvPopular',
    },
    {
        url: BASE_URL_OF_API + `/tv/on_the_air?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,
        options: {},
        dependencies: [],
        saveToSession: true, 
        sessionStorageName: 'tvLatest',
    },

    
    
]


const HomePage = (): JSX.Element => {
      
    const getTrendingMovies = useFetch(USE_FETCH_SETTINGS[0].url, USE_FETCH_SETTINGS[0].options, 
        USE_FETCH_SETTINGS[0].dependencies, USE_FETCH_SETTINGS[0].saveToSession, USE_FETCH_SETTINGS[0].sessionStorageName)
    
    const getPopularMovies = useFetch(USE_FETCH_SETTINGS[2].url, USE_FETCH_SETTINGS[2].options, 
        USE_FETCH_SETTINGS[2].dependencies, USE_FETCH_SETTINGS[2].saveToSession, USE_FETCH_SETTINGS[2].sessionStorageName)  
    
    const getTvShows = useFetch(USE_FETCH_SETTINGS[5].url, USE_FETCH_SETTINGS[5].options, 
        USE_FETCH_SETTINGS[5].dependencies, USE_FETCH_SETTINGS[5].saveToSession, USE_FETCH_SETTINGS[5].sessionStorageName)
        
    console.log(getTvShows)    
    
    const moviePreviewType = ( {movie, originalImageSize = false}: {movie: any, originalImageSize?: boolean}): moviePreviewType => {

        const moviePreview: moviePreviewType  = {
            id: movie.id,
            releaseDate: movie.release_date,
            fullTitle: movie.title,
            rating: movie.vote_average,
            overview: movie.overview,
            image: originalImageSize? BASE_URL_FOR_IMAGES() + movie.poster_path: BASE_URL_FOR_IMAGES("w342") + movie.poster_path,
            ratingCount: movie.vote_count,
        }
        return moviePreview
    }

    const moviePreviewTypeWithTvShow = ( {tvShow, originalImageSize = false}: {tvShow: any, originalImageSize?: boolean}): moviePreviewType => {

        const moviePreview: moviePreviewType  = {
            id: tvShow.id,
            releaseDate: tvShow.first_air_date,
            fullTitle: tvShow.name,
            rating: tvShow.vote_average,
            overview: tvShow.overview,
            image: originalImageSize? BASE_URL_FOR_IMAGES() + tvShow.poster_path: BASE_URL_FOR_IMAGES("w342") + tvShow.poster_path,
            ratingCount: tvShow.vote_count,
            media_type: "tv"
        }
        return moviePreview
    }

    const showTwelveMovies = (movies: any, number: number): JSX.Element[] => {
       
        let n = Math.min(20, movies.length)
        var elements = [];
        
        for(let i=0; i < n; i++){
            let numberToPass: number = parseInt((i.toString() + number.toString()))
            elements.push(<MoviePreview key={i} number={numberToPass} movie={moviePreviewType({movie: movies[i]})}></MoviePreview>);
        }
        return elements;
    }


    const showTwelveTvShows = (tvShows: any, number: number): JSX.Element[] => {
        
        let n = Math.min(20, tvShows.length)
        var elements = [];
        
        for(let i=0; i < n; i++){
            let numberToPass: number = parseInt((i.toString() + number.toString()))
            elements.push(<MoviePreview key={i} movie={moviePreviewTypeWithTvShow({tvShow: tvShows[i]})} 
            number={numberToPass}></MoviePreview>);
        }
        return elements;
    }
    

    const changeSelected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, number: number):void => {
        let element = e.target as HTMLTextAreaElement

        let whichMovieToChange
        console.log(number)
        let selectedCategory
        if(number<2){
            selectedCategory = document.getElementById("selected category trending")
            whichMovieToChange = getTrendingMovies
        }
        else if(number<5){
            selectedCategory = document.getElementById("selected category movies")
            whichMovieToChange = getPopularMovies
        }
        else{
            selectedCategory = document.getElementById("selected category tv shows")
            whichMovieToChange = getTvShows
        }
        

        if(selectedCategory){
            element.append(selectedCategory)
            console.log(element)
        }
        
        whichMovieToChange.changeUrl(USE_FETCH_SETTINGS[number].url, USE_FETCH_SETTINGS[number].options, 
             USE_FETCH_SETTINGS[number].saveToSession, USE_FETCH_SETTINGS[number].sessionStorageName)
             
    }


    return(
        <div>
            <div>
                <div>
                    { !getTrendingMovies.fetchDataStatus.loading ? (
                        <span >
                            { getTrendingMovies.fetchDataStatus.value !== undefined ? (
                                <Hero movie={moviePreviewType({
                                    movie: getTrendingMovies.fetchDataStatus.value.results[0],
                                    originalImageSize: true})}
                                ></Hero>
                            ):(
                                <div className="error-message" >Something went wrong, try again</div>
                            )}
                        </span>
                    ):(
                        <LoadingCircle></LoadingCircle>
                    )}
                    <div className="header">
                        <span> Trending </span>
                        <div className="selector">
                    
                            <div onClick={(e) => changeSelected(e, 1) } className="anchor">
                                <h3>
                                    <span  className="no_click"  >Today</span>

                                </h3>
                                
                            </div>
                            <div onClick={(e) => changeSelected(e, 0) } className="anchor">
                                <h3>
                                    <span  className="no_click"  >This week</span>
                                    <div id="selected category trending" className="background" ></div>
                                </h3>
                            </div>
        
                        </div>
                    
                    </div>
                    <div className="container-with-scroll">
                        { !getTrendingMovies.fetchDataStatus.loading ? (
                            <span >
                                { getTrendingMovies.fetchDataStatus.value !== undefined ? (    
                                    <div className="box">
                                        {showTwelveMovies(getTrendingMovies.fetchDataStatus.value.results, 10)}
                                    </div>
                                ):(
                                    <div className="error-message" >Something went wrong, try again</div>
                                )}    
                            </span>
                        ):(
                            <LoadingCircle></LoadingCircle>
                        )}
                    </div>
                </div>    
                <div className="header">
                    <span> Movie </span>
                    <div className="selector">
                
                        <div onClick={(e) => changeSelected(e, 2) } className="anchor">
                            <h3>
                                <span  className="no_click"  >All time</span>
                                <div id="selected category movies" className="background" ></div>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 3) } className="anchor">
                            <h3>
                                <span  className="no_click" >New</span>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 4) } className="anchor">
                            <h3>
                                <span  className="no_click" >Upcoming</span>
                            </h3>
                        </div>
                    </div>  
                </div>
                <div className="container-with-scroll">
                    { !getPopularMovies.fetchDataStatus.loading ? (
                        <span >
                            { getPopularMovies.fetchDataStatus.value !== undefined ? (    
                                <div className="box">
                                    {showTwelveMovies(getPopularMovies.fetchDataStatus.value.results, 11)}
                                </div>
                            ):(
                                <div className="error-message" >Something went wrong, try again</div>
                            )}    
                        </span>
                    ):(
                        <LoadingCircle></LoadingCircle>
                    )}
                </div>
                <div className="header">
                    <span> Tv shows </span>
                    <div className="selector">
                
                        <div onClick={(e) => changeSelected(e, 5) } className="anchor">
                            <h3>
                                <span  className="no_click"  >All time</span>
                                <div id="selected category tv shows" className="background" ></div>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 6) } className="anchor">
                            <h3>
                                <span  className="no_click" >New</span>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 7) } className="anchor">
                            <h3>
                                <span  className="no_click" >On the air</span>
                            </h3>
                        </div>
                    </div>  
                </div>
                <div className="container-with-scroll">
                    { !getTvShows.fetchDataStatus.loading ? (
                        <span >
                            { getTvShows.fetchDataStatus.value !== undefined ? (    
                                <div className="box">
                                    {showTwelveTvShows(getTvShows.fetchDataStatus.value.results, 12)}
                                </div>
                            ):(
                                <div className="error-message" >Something went wrong, try again</div>
                            )}    
                        </span>
                    ):(
                        <LoadingCircle></LoadingCircle>
                    )}
                </div>
            </div>
        </div>     
    )   
}

export default HomePage