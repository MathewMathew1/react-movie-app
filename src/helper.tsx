import { moviePreviewType } from "./types/types"
import { BASE_URL_FOR_IMAGES } from "./ApiVariables"

const moviePreviewTypeFunction = ( {movie, originalImageSize = false, mediaType = "movie"}: {movie: any, originalImageSize?: boolean, 
    mediaType?: string}): moviePreviewType => {

    const moviePreview: moviePreviewType  = {
        id: movie.id,
        releaseDate: mediaType==="movie"? movie.release_date: movie.first_air_date,
        fullTitle: mediaType==="movie"? movie.title: movie.name,
        rating: movie.vote_average,
        overview: movie.overview,
        image: originalImageSize? BASE_URL_FOR_IMAGES() + movie.poster_path: BASE_URL_FOR_IMAGES("w342") + movie.poster_path,
        ratingCount: movie.vote_count,
        media_type: mediaType
    }
    
    return moviePreview
}

export {moviePreviewTypeFunction}