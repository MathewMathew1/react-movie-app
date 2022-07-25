

import useFetch from "../../customHooks/useFetch"
import {BASE_URL_OF_API} from "../../ApiVariables"
import { useState, useEffect } from "react"
import LoadingCircle from "../../mini-components/LoadingCircle"
import PaginationComponent from "../../mini-components/Pagination"
import MovieNotFound  from "../NotFound/MovieNotFound"
import { showTwentyMovies } from "../../helper"
import { useSearchParams } from "react-router-dom"

const MovieSearch = (): JSX.Element => {
    const [searchKeyWord, setSearchKeyWord] = useState('')
    const [linkToPagination, setLinkToPagination] = useState('')
    const getMovies = useFetch('',{},[]) 
    const [searchParams] = useSearchParams()
    
    console.log(getMovies)

    useEffect(() => {
        let url: string =''
        let link: string = '?'

        let searchParamsObject = Object.fromEntries([...searchParams])
        let page = searchParamsObject["page"]
        let genreId = searchParamsObject["genre_id"] 
        let searchedName = searchParamsObject["name"]
        
        if(typeof(genreId) == "string" ){
            
            link = `genre_id=` + genreId

            setSearchKeyWord(genreId)
            document.title = genreId
            url = BASE_URL_OF_API + 
            `/discover/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&page=${page}&include_adult=false` 
            + `&with_genres=${genreId}`
        
        }
        else if(typeof(searchedName) == "string"){
            
            link += `name=` + searchedName  

            setSearchKeyWord(searchedName)
            document.title = searchedName
            url = BASE_URL_OF_API + 
            `/search/movie?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}` 
            + `&query=${searchedName}`
        }
        setLinkToPagination(link)

        getMovies.changeUrl({newUrl: url})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);


    useEffect(() => {
        let searchParamsObject = Object.fromEntries([...searchParams])
        let genreId = searchParamsObject["genre_id"] 
        let searchedName = searchParamsObject["name"]

        if(typeof(genreId) == "string" ){
            setSearchKeyWord(genreId)
            document.title = genreId
        }
        else if(typeof(searchedName) == "string"){
            setSearchKeyWord(searchedName)
            document.title = searchedName
        }

    }, [searchParams]);
    console.log(getMovies.fetchDataStatus.value?.total_results)

    return(
        <div>
            <div >
                <div className="center-text"> <h3 style={{color: "white"}}>Results for {searchKeyWord} search </h3> </div>
                { !getMovies.fetchDataStatus.loading ? (
                    <div>
                        { getMovies.fetchDataStatus.value !== undefined && getMovies.fetchDataStatus.value?.total_results !== 0 ? (
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