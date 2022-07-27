import { actorInfoType, moviePreviewType } from "../../types/types"
import useFetch from "../../customHooks/useFetch"
import Actor from "./Actor"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { useParams } from "react-router-dom"


const ActorInfo = (): JSX.Element => {

    let params = useParams()
    const getActor = useFetch( BASE_URL_OF_API + `/person/${params.id}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{},[])
    const getCreditsForActor =  useFetch( BASE_URL_OF_API + `/person/${params.id}/combined_credits?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{},[]) 


    const moviePreviewType = ( {movie, originalImageSize = false}: {movie: any, originalImageSize?: boolean}): moviePreviewType => {

        const moviePreview: moviePreviewType  = {
            id: movie.id,
            releaseDate: movie.release_date? movie.release_date: movie.first_air_date,
            fullTitle: movie.title? movie.title: movie.name,
            rating: movie.vote_average,
            overview: movie.overview,
            image: originalImageSize? BASE_URL_FOR_IMAGES() + movie.poster_path: BASE_URL_FOR_IMAGES("w342") + movie.poster_path,
            ratingCount: movie.vote_count,
            media_type: movie.media_type
        }
        return moviePreview
    }

    
    const actorData = (actor: any): actorInfoType  => {
        let moviesAsACast: moviePreviewType[] = []
        for(let i=0; i < getCreditsForActor.fetchDataStatus.value.cast.length; i++){

            let moviePreview = moviePreviewType({movie:getCreditsForActor.fetchDataStatus.value.cast[i]})
            
            moviesAsACast.push(moviePreview)
        }
        
        let moviesAsACrew: moviePreviewType[] = []
        for(let i=0; i < getCreditsForActor.fetchDataStatus.value.crew.length; i++){

            let moviePreview = moviePreviewType({movie:getCreditsForActor.fetchDataStatus.value.crew[i]})
            moviesAsACrew.push(moviePreview)
        }

        const actorData: actorInfoType  = {
            alsoKnownAs: actor.also_known_as,
            biography: actor.biography,
            birthDay: actor.birthday,
            deathday: actor.deathday,
            homepage: actor.homepage,
            id: actor.id,
            department: actor.known_for_department,
            name: actor.name,
            placeOfBirth: actor.place_of_birth,
            image: BASE_URL_FOR_IMAGES() + actor.profile_path,
            castPerformance: moviesAsACast,
            crewPerformance: moviesAsACrew,
        }

        return actorData
    }

    return(
        <div>
           { !getActor.fetchDataStatus.loading && !getCreditsForActor.fetchDataStatus.loading  ? (
                <div>
                    { getActor.fetchDataStatus.value=== undefined ? (
                        <div className="center informationBox">404 Unable to find Actor</div>
                    ):(
                        <Actor actor={actorData(getActor.fetchDataStatus.value)}></Actor>
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

export default ActorInfo