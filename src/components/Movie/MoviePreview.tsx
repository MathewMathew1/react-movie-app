
import { Card, Button } from "react-bootstrap"
import { moviePreviewType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import RatingMovie from "../../mini-components/RatingMovie";

const VAR = {
    LENGTH_OF_DESCRIPTION: 200
}

const MoviePreview = ({movie, number}: { movie: moviePreviewType, number: number}): JSX.Element => {


    const partOfDescription = (): string => {
        return movie.overview.substring(0, VAR.LENGTH_OF_DESCRIPTION)+ "..."
    }

    const urlForMorInfo = (): string => {
        if(movie.media_type==="tv"){
            return '/search/tvShow?id=' + movie.id
        }
        return '/search/movie?id=' + movie.id
    }

    return (
        <div>
            <Card className="whole-height" >
                <Card.Img className="rescaled-image" loading="lazy"  
                alt={movie.fullTitle} variant="top" width="100%" height="300px"  
                src={movie.image}  />
                <RatingMovie id={movie.id} mediaType={movie.media_type}></RatingMovie>
                <div className="container">
                    <Card.Title className="margin-right">{movie.fullTitle}</Card.Title>
                    <CircleProgressBar rating={movie.rating} number={number}></CircleProgressBar>
                    <div className="center-text">{movie.ratingCount} votes</div>
                </div>
                <Card.Body className="aas">
                    <Card.Text>
                        {partOfDescription()}
                    </Card.Text>
                    <div >Release Date: {movie.releaseDate}</div>
                </Card.Body>
                <div className="bottom-right">
                    <Button as="a" href={urlForMorInfo()} variant="primary">More info</Button>
                    <i style={{height: "1rem", width: "2rem" }} className="far fa-star"></i>
                </div>
                <i className="fas fa-camera"></i> 
            </Card>
        </div>  
    )      
}

export default MoviePreview