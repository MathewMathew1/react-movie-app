

import { moviePreviewType } from "../../types/types"
import MoviePreview from "./MoviePreview"
import useFetch from "../../customHooks/useFetch"
import queryString from "query-string"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import { useState, useEffect } from "react"
import LoadingCircle from "../../mini-components/LoadingCircle"
import PaginationComponent from "../../mini-components/Pagination"
import MovieNotFound  from "../NotFound/MovieNotFound"


const MovieSearch = ({location}: {location: any}): JSX.Element => {
    const [searchKeyWord, setSearchKeyWord] = useState('')
    const [totalResults, setTotalResults] = useState(0)
    const [linkToPagination, setLinkToPagination] = useState('')
    const getMovies = useFetch('',{},[]) 
    
    console.log(getMovies)

    const showTwelveMovies = (movies: any): JSX.Element[] => {
        let n = Math.min(20, movies.length)
        let elements: any[] = [];
        for(let i=0; i < n; i++){
            elements.push(<MoviePreview key={i} movie={moviePreviewType(getMovies.fetchDataStatus.value.results[i])} number={i}></MoviePreview>);
        }
        return elements;
    }
    
        const moviePreviewType = (movie: any): moviePreviewType => {
        const moviePreview: moviePreviewType  = {
            id: movie.id,
            releaseDate: movie.release_date,
            fullTitle: movie.title,
            rating: movie.vote_average,
            overview: movie.overview,
            image: BASE_URL_FOR_IMAGES() + movie.poster_path,
            ratingCount: movie.vote_count,
        }
        return moviePreview
    }

    useEffect(() => {
        
        let filter: queryString.ParsedQuery<string> = queryString.parse(location.search)
        let url: string =''
        let page: string | string[] = filter["page"]
        let link: string = '?'
        
        if("genre_id" in filter && typeof(filter["genre_id"])==='string' ){
            
            link = `genre_id=` + filter["genre_id"]
            
            let searchedGenre = filter["genre_id"]
            setSearchKeyWord(searchedGenre)
            document.title = searchedGenre
            url = BASE_URL_OF_API + 
            `/discover/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&page=${page}&include_adult=false` 
            + `&with_genres=${searchedGenre}`
        
        }
        else if( "name" in filter && typeof(filter["name"])==='string'){
            
            link += `name=` + filter["name"]  

            let searchedName = filter["name"]
            setSearchKeyWord(searchedName)
            document.title = searchedName
            url = BASE_URL_OF_API + 
            `/search/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}` 
            + `&query=${searchedName}`
        }
        setLinkToPagination(link)

        getMovies.changeUrl(url,{})
        
    }, [location.search]);


    useEffect(() => {
        let filter: queryString.ParsedQuery<string> = queryString.parse(location.search)

        if("genre_id" in filter && typeof(filter["genre_id"])==='string' ){
            setSearchKeyWord(filter["genre_id"])
            document.title = filter["genre_id"]
        }
        else if( "name" in filter && typeof(filter["name"])==='string'){
            setSearchKeyWord(filter["name"])
            document.title = filter["name"]
        }

    }, [location.search]);

    const restOfPagination = () => {

    }

    return(
        <div>
            <div >
                <div className="center-text"> <h3 style={{color: "white"}}>Results for {searchKeyWord} search </h3> </div>
                { !getMovies.fetchDataStatus.loading ? (
                    <div>
                        { getMovies.fetchDataStatus.value !== undefined ? (
                            <div>
                                <div className="movie-preview-container margin-btm-3">
                                    {showTwelveMovies(getMovies.fetchDataStatus.value.results)}
                                    
                                </div>
                                <PaginationComponent currentPage={getMovies.fetchDataStatus.value.page} link={linkToPagination} numberOfPages={getMovies.fetchDataStatus.value.total_pages}></PaginationComponent>
                            </div>
                        ):(
                            <MovieNotFound ></MovieNotFound>
                        )}
                    </div>
                ):(
                    <div>
                        <LoadingCircle></LoadingCircle>
                    </div>
                )}
            </div>
            
        </div>     
    )   
}

export default MovieSearch