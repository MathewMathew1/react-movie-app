
import { actorType, movieReview, userReviewInfo, tvShowType, episode } from "../../types/types"
import TvShow from "./TvShow"
import useFetch from "../../customHooks/useFetch"

import queryString from "query-string"
import {BASE_URL_OF_API, BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import LoadingCircle from "../../mini-components/LoadingCircle"
import { useParams } from "react-router-dom"






    

const EpisodeInfo = (): JSX.Element => {
    let id = useParams().id
    const getTvEpisode = useFetch( BASE_URL_OF_API + `/tv/${id}?api_key=054d81c0a2132b241e5db5c64009ef65`,{},[]) 
    const getActors = useFetch( BASE_URL_OF_API + `/tv/${id}/credits?api_key=054d81c0a2132b241e5db5c64009ef65`,{},[]) 

    return(
        <div>
          
        </div>     
    )   
}

export default EpisodeInfo 