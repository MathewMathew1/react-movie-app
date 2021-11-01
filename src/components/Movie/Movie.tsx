import { movieFullType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import { ListGroup } from "react-bootstrap";
import { useEffect } from "react";
import RatingLabel from "../../mini-components/RatingLabel";
import person from "../../person.png"
import ActorList from "../Actors/ActorList"

const Movie = ({movie}: { movie: movieFullType}) => {

    
    const listOFGenres = (): string[] => {

        let ListOfGenres = movie.genres.map(a => a.name)
        return ListOfGenres

    }

    const imagePath = (UrlString: string): string => {
        if(UrlString===''){
            return `url(${person})`
        }
        return `url(${UrlString})`
    }

    useEffect(() => {
        document.title = movie.fullTitle
    }, []);

    const date = (date: string): string =>{
        let dateOfCreation = new Date(date)
        return dateOfCreation.getDate() + "/" + (dateOfCreation.getMonth()+1)+ "/" + dateOfCreation.getFullYear()
    }

    return (
        <div className="full-movie">
            
            <div className="background-image" style={{backgroundImage: `url(${movie.image})`}}></div>
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
                        {movie.homepage!==""? <span> <a href={movie.homepage} target="_blank">Homepage</a>,&nbsp;</span>:null} 
                        Original Language: {movie.originalLanguage},&nbsp; Status: {movie.status}
                    </div>
                    <div>Directed by: {movie.directors.join(", ")}</div>
                    <div>Genres: {listOFGenres().join(",  ")}</div>
                    <div >Release Date: {movie.releaseDate}</div>
                </div>
            </div>
            <div className="review-list">
                <h3>Reviews:</h3>
                { movie.reviews.length > 0 ? (
                    <div className="scrollable">
                        <ListGroup className="" as="ol" numbered>
                            
                            {movie.reviews.map((value, index) => {
                                return(
                                    <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto text-break inline-block">
                                            <div className="fw-bold  ">
                                                <div className="container">
                                                    <div className="icon profile" style={{backgroundImage: imagePath(value.authorDetails.avatar_image)}}></div>
                                                    {value.author}
                                                    <span className="date"> {date(value.createdDate)} </span>
                                                </div>    
                                                { value.authorDetails.rating!==null ? (
                                                    <RatingLabel rating={value.authorDetails.rating} number={index}></RatingLabel>
                                                ):null}
                                                
                                            </div>
                                                {value.content}
                                        </div>

                                    </ListGroup.Item>                               
                                )
                            })}    
                        </ListGroup>
                    </div> 
                ):(
                    <div>No reviews so far</div>
                )}   
            </div>    
        </div>  
    )      
}

export default Movie