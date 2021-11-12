import { movieFullType, actorType, movieReview, userReviewInfo } from "../../types/types"
import Movie from "./Movie"
import useFetch from "../../customHooks/useFetch"
import queryString from "query-string"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import LoadingCircle from "../../mini-components/LoadingCircle"
import MovieNotFound from "../NotFound/MovieNotFound"

const MovieInfo = ({location}: { location: any}): JSX.Element => {
 
    let filter = queryString.parse(location.search)
    let id = filter["id"]
    const getMovie = useFetch( BASE_URL_OF_API + `/movie/${id}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{},[]) 
    const getActors = useFetch( BASE_URL_OF_API + `/movie/${id}/credits?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{},[]) 
    const getReviews = useFetch( BASE_URL_OF_API + `/movie/${id}/reviews?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{},[])  

    console.log(getMovie)

    const FullMovieData = (movie: any, actors: any, reviews: any): movieFullType => {


        let reviewsList: movieReview[] = []
        if(reviews!==undefined){

            for(let i=0; i<reviews.results.length; i++){

                let image: string = ""

                if(reviews.results[i].author_details.avatar_path===null){
                    image =''
                }
                else if(reviews.results[i].author_details.avatar_path.startsWith("/https")){
                    let stringUrl: string = reviews.results[i].author_details.avatar_path
                    image = stringUrl.slice(0, 0) + stringUrl.slice(1, stringUrl.length) 
                }
                else{
                    image = BASE_URL_FOR_IMAGES() + reviews.results[i].author_details.avatar_path
                }
                let userReviewInfo: userReviewInfo = {
                    avatar_image: image,
                    username: reviews.results[i].author_details.name,
                    rating: reviews.results[i].author_details.rating,
                }

                let review: movieReview = {
                    author: reviews.results[i].author,
                    id: reviews.results[i].id,
                    content: reviews.results[i].content,
                    createdDate:  reviews.results[i].created_at,
                    updatedDate: reviews.results[i].updated_at,
                    authorDetails: userReviewInfo,
                }
                reviewsList.push(review)
            }
        }
        
        let actorList: actorType[] = []
        for(let i=0; i<actors.cast.length; i++){
            let actor: actorType = {
                id: actors.cast[i].id,
                image: BASE_URL_FOR_IMAGES() + actors.cast[i].profile_path,
                name: actors.cast[i].name
            }
            actorList.push(actor)
        }
        
        let directors: string[] = []
        for(let i=0; i<actors.crew.length; i++){
            if(actors.crew[i].job ==="Director"){
                directors.push(actors.crew[i].name)
            }
        }
        
        const fullMovie: movieFullType  = {
            directors: directors,
            id: movie.id,
            releaseDate: movie.release_date,
            fullTitle: movie.title,
            rating: movie.vote_average,
            overview: movie.overview,
            image: BASE_URL_FOR_IMAGES() + movie.poster_path,
            ratingCount: movie.vote_count,
            actorList: actorList,
            genres: movie.genres,
            tagline: movie.tagline,
            companies: movie.production_companies,
            reviews: reviewsList,
            status: movie.status,
            homepage: movie.homepage,
            originalLanguage: movie.original_language
        }

        return fullMovie
      }
    

    return(
        <div>
            { !getMovie.fetchDataStatus.loading && !getActors.fetchDataStatus.loading ? (
                <div>
                    { getMovie.fetchDataStatus.value === undefined || getActors.fetchDataStatus.value === undefined ? (
                        <MovieNotFound></MovieNotFound>
                    ):(
                        <Movie movie={FullMovieData(getMovie.fetchDataStatus.value, getActors.fetchDataStatus.value, getReviews.fetchDataStatus.value)}></Movie>
                    )}
                </div>
            ):(
                <div>
                    <LoadingCircle></LoadingCircle>
                </div> 
            )}
        </div>     
    )   
}

export default MovieInfo
