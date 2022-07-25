import { moviePreviewType } from "./types/types"
import { BASE_URL_FOR_IMAGES } from "./ApiVariables"
import MoviePreview from "./components/Movie/MoviePreview"


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

const showTwentyMovies = (movies: any, number: number, mediaType?: string): JSX.Element[] => {
       
    let n = Math.min(20, movies.length)
    var elements = [];
    moviePreviewTypeFunction({movie: movies[0], mediaType: mediaType })
    for(let i=0; i < n; i++){
        let numberToPass: number = parseInt((i.toString() + number.toString()))
        elements.push(<MoviePreview key={i} number={numberToPass} movie={moviePreviewTypeFunction({movie: movies[i], mediaType: mediaType })}></MoviePreview>);
    }
    
    return elements;
}



export {moviePreviewTypeFunction, showTwentyMovies}