

import { moviePreviewType } from "../../types/types"
import MoviePreview from "./MoviePreview"
import useFetch from "../../customHooks/useFetch"
import queryString from "query-string"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import { useState, useEffect } from "react"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { Pagination} from "react-bootstrap"
import MovieNotFound  from "../NotFound/MovieNotFound"


const MovieSearch = ({location}: {location: any}): JSX.Element => {
    const [searchKeyWord, setSearchKeyWord] = useState('')

    const getUrl = (): string => {
        let filter: queryString.ParsedQuery<string> = queryString.parse(location.search)
        let url: string =''
        if("genre_id" in filter){
            url = BASE_URL_OF_API + 
            `/discover/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&page=1&include_adult=false&page=1` 
            + `&with_genres=${filter["genre_id"]}`
        }
        else if( "name" in filter){
            url = BASE_URL_OF_API + 
            `/search/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1` 
            + `query=${filter["name"]}`
        }
        return url
    }
    

    const getMovies = useFetch(getUrl(),{},[]) 
    

    const showTwelveMovies = (movies: any): JSX.Element[] => {
        let n = Math.min(20, movies.length)
        var elements = [];
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

        if("genre_id" in filter && typeof(filter["genre_id"])==='string' ){
            setSearchKeyWord(filter["genre_id"])
            document.title = filter["genre_id"]
        }
        else if( "name" in filter && typeof(filter["name"])==='string'){
            setSearchKeyWord(filter["name"])
            document.title = filter["name"]
        }

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

    return(
        <div>
            <div >
                <div className="center-text"> <h3 style={{color: "white"}}>Results for {searchKeyWord} search </h3> </div>
                { !getMovies.fetchDataStatus.loading ? (
                    <div>
                        { getMovies.fetchDataStatus.value !== undefined ? (
                            <div className="movie-preview-container">
                                {showTwelveMovies(getMovies.fetchDataStatus.value.results)}
                                <div className="pagination flex-center">
                                    <Pagination>
                                        <Pagination.First />
                                        <Pagination.Prev />
                                        <Pagination.Item>{1}</Pagination.Item>
                                        <Pagination.Ellipsis />

                                        <Pagination.Item>{10}</Pagination.Item>
                                        <Pagination.Item>{11}</Pagination.Item>
                                        <Pagination.Item active>{12}</Pagination.Item>
                                        <Pagination.Item>{13}</Pagination.Item>
                                        <Pagination.Item disabled>{14}</Pagination.Item>

                                        <Pagination.Ellipsis />
                                        <Pagination.Item>{20}</Pagination.Item>
                                        <Pagination.Next />
                                        <Pagination.Last />
                                    </Pagination>
                                </div>
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