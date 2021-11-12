import { movieFullType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import { useEffect } from "react";
import ReviewList from "../Reviews/ReviewList";
import ActorList from "../Actors/ActorList"
import RatingMovie from "../../mini-components/RatingMovie";

const Movie = ({movie}: { movie: movieFullType}): JSX.Element => {

    
    const listOFGenres = (): string[] => {

        let ListOfGenres = movie.genres.map(a => a.name)
        return ListOfGenres

    }

 

    useEffect(() => {
        document.title = movie.fullTitle
    }, [movie.fullTitle]);



    return (
        <div className="full-movie">
            
            <div className="background-image" style={{backgroundImage: `url(${movie.image})`}}>
                <RatingMovie id={movie.id} mediaType={"movie"}></RatingMovie>
            </div>
            <ActorList actorList={movie.actorList}></ActorList>
            <div className="container">
                <h3 style={{marginRight: "1rem"}}>{movie.fullTitle}</h3>
                <CircleProgressBar rating={movie.rating}></CircleProgressBar>
                <div className="center-text">Based on: {movie.ratingCount} votes</div>
            </div>
            <div className="cursive">
                {movie.tagline}
            </div> 
            <div className="movie-description">
                {movie.overview}
            </div>
            <div className="Info-panel">
                <div className="secondary-info">
                    <div>
                        {movie.homepage!==""? <span> <a rel="noreferrer" href={movie.homepage} target="_blank">Homepage</a>,&nbsp;</span>:null} 
                        Original Language: {movie.originalLanguage},&nbsp; Status: {movie.status}
                    </div>
                    <div>Directed by: {movie.directors.join(", ")}</div>
                    <div>Genres: {listOFGenres().join(",  ")}</div>
                    <div >Release Date: {movie.releaseDate}</div>
                </div>
            </div>
            <ReviewList reviews={movie.reviews}></ReviewList>
        </div>  
    )      
}

export default Movie