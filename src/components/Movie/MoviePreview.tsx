
import { Card, Button } from "react-bootstrap"
import { moviePreviewType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"

const VAR = {
    LENGTH_OF_DESCRIPTION: 200
}

const MoviePreview = ({movie, number}: { movie: moviePreviewType, number: number}) => {


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
                </div>
            </Card>
        </div>  
    )      
}

export default MoviePreview