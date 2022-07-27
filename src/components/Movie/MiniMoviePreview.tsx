


import { Card, Button } from "react-bootstrap"
import { moviePreviewType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import { Link } from "react-router-dom";

const VAR = {
    LENGTH_OF_DESCRIPTION: 200
}

const MiniMoviePreview = ({movie, number, isItTvShow = false}: { movie: moviePreviewType, number: number, isItTvShow?: boolean}): JSX.Element => {


    const partOfDescription = (): string => {
        return movie.overview.substring(0, VAR.LENGTH_OF_DESCRIPTION)+ "..."
    }

    const urlForMorInfo = (): string => {
        if(movie.media_type==="movie"){
            return '/search/movie/' + movie.id
        }
        return '/search/tvShow/' + movie.id
    }

    const capitalizeFirstLetter = (text: string)=> {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    return (
        <div>
            <Card className="whole-height" >
                <div className="container">
                    <Link to={urlForMorInfo()} title={movie.fullTitle}>
                        <img className="rescaled-image" loading="lazy"  alt={movie.fullTitle}  width="100px" src={movie.image} />
                    </Link>
                    <Card.Title className="margin-right">{movie.fullTitle}</Card.Title>
                </div>
                <div className="container">
                    <CircleProgressBar rating={movie.rating} number={number}/>
                    <div className="center-text">{movie.ratingCount} votes</div>
                </div>
                <Card.Body style={{height: 250, overflow: "auto"}}>
                    <Card.Text>
                        {partOfDescription()}
                    </Card.Text>
                    <div >Release Date: {movie.releaseDate}</div>
                </Card.Body>
                <div className="bottom-right">
                    <Button title={movie.fullTitle} as="a" href={urlForMorInfo()} variant="primary">
                        {capitalizeFirstLetter(movie.media_type)} Info
                    </Button>
                </div>
            </Card>
        </div>  
    )      
}

export default MiniMoviePreview