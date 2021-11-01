import { actorType, movieReview, userReviewInfo, tvShowType, episode } from "../../types/types"
import TvShow from "./TvShow"
import useFetch from "../../customHooks/useFetch"

import queryString from "query-string"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import LoadingCircle from "../../mini-components/LoadingCircle"






    

const TvShowInfo = ({location}: { location: any}): JSX.Element => {

    let filter = queryString.parse(location.search)
    let id = filter["id"]
    const getTvShow = useFetch( BASE_URL_OF_API + `/tv/${id}?api_key=054d81c0a2132b241e5db5c64009ef65`,{},[]) 
    const getActors = useFetch( BASE_URL_OF_API + `/tv/${id}/credits?api_key=054d81c0a2132b241e5db5c64009ef65`,{},[]) 
    const getReviews = useFetch( BASE_URL_OF_API + `/tv/${id}/reviews?api_key=054d81c0a2132b241e5db5c64009ef65`,{},[])
    
    console.log(getTvShow)

    const FullMovieData = (tvShow: any, actors: any, reviews: any): tvShowType => {
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
        
        let lastEpisode: episode = {
            id: tvShow.last_episode_to_air.id,
            name: tvShow.last_episode_to_air.name,
            air_date: tvShow.last_episode_to_air.air_date,
            episodeNumber: tvShow.last_episode_to_air.episode_number,
            overview: tvShow.last_episode_to_air.overview,
            image: BASE_URL_FOR_IMAGES()+tvShow.last_episode_to_air.still_path,
            voteAverage: tvShow.last_episode_to_air.vote_average,
            voteCount: tvShow.last_episode_to_air.vote_count,
        }
        
        const fullMovie: tvShowType  = {
            id: tvShow.id,
            firstAirDate: tvShow.first_air_date,
            name: tvShow.name,
            rating: tvShow.vote_average,
            overview: tvShow.overview,
            image: BASE_URL_FOR_IMAGES() + tvShow.poster_path,
            ratingCount: tvShow.vote_count,
            actorList: actorList,
            genres: tvShow.genres,
            tagline: tvShow.tagline,
            reviews: reviewsList,
            numberOfEpisodes: tvShow.number_of_episodes,
            numberOfSeasons: tvShow.number_of_seasons,
            inProduction: tvShow.in_production,
            status: tvShow.status,
            networks: tvShow.networks,
            homepage: tvShow.homepage,
            lastEpisodeToAir: lastEpisode,
            originalLanguage: tvShow.original_language
        }

        /*actorList: actorType[];
            genres: genreType[];
            directors: string[];
            lastEpisodeToAir: episode;
            numberOfSeasons: number;
            numberOfEpisodes: number;
            reviews: movieReview[];
            tagline: string;
            status: string;
            inProduction: true;
            networks: productionCompanies[];
            homepage: string;*/

        return fullMovie
    }


    

    return(
        <div>
           { !getTvShow.fetchDataStatus.loading && !getActors.fetchDataStatus.loading  ? (
                <div>
                    { getTvShow.fetchDataStatus.value === undefined ? (
                        <div className="center informationBox">404 Unable to Tv show</div>
                    ):(
                        <TvShow tvShow={FullMovieData(getTvShow.fetchDataStatus.value, getActors.fetchDataStatus.value, getReviews.fetchDataStatus.value)}></TvShow>
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

export default TvShowInfo
