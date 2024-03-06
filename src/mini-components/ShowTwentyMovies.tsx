import MoviePreview from "../components/Movie/MoviePreview"
import { moviePreviewTypeFunction } from "../helper"

const ShowTwentyMovies = ({movies, number, mediaType}:{movies: any, number: number, mediaType?: string}): JSX.Element => {
    let n = Math.min(20, movies.length)

    return (
        <>
            {Array.from(Array(n), (e, i) => {
                let numberToPass: number = parseInt((i.toString() + number.toString()))
                return (
                    <MoviePreview key={`${i} movie`} number={numberToPass} 
                        movie={moviePreviewTypeFunction({movie: movies[i], mediaType: mediaType })}/>
                )    
            })}    
        </>
    )

}

export default ShowTwentyMovies