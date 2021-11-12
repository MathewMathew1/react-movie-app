

import useFetch from "../../customHooks/useFetch"
import queryString from "query-string"
import {BASE_URL_OF_API} from "../../ApiVariables"
import { useState, useEffect } from "react"
import LoadingCircle from "../../mini-components/LoadingCircle"
import PaginationComponent from "../../mini-components/Pagination"
import MovieNotFound  from "../NotFound/MovieNotFound"
import { showTwentyMovies } from "../../helper"

const MovieSearch = ({location}: {location: any}): JSX.Element => {
    const [searchKeyWord, setSearchKeyWord] = useState('')
    const [linkToPagination, setLinkToPagination] = useState('')
    const getMovies = useFetch('',{},[]) 
    
    console.log(getMovies)

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


    return(
        <div>
            <div >
                <div className="center-text"> <h3 style={{color: "white"}}>Results for {searchKeyWord} search </h3> </div>
                { !getMovies.fetchDataStatus.loading ? (
                    <div>
                        { getMovies.fetchDataStatus.value !== undefined || getMovies.fetchDataStatus.value?.total_results === 0 ? (
                            <div>
                                <div className="movie-preview-container margin-btm-3">
                                    {showTwentyMovies(getMovies.fetchDataStatus.value.results, 10)}
                                    
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