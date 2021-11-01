
import { tvShowType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import { ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import RatingLabel from "../../mini-components/RatingLabel";
import person from "../../person.png"
import EpisodePreview from "../EpisodePreview";
import {BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import { Table } from "react-bootstrap";
import ActorList from "../Actors/ActorList";

const INFORMATION_TO_SHOW = [
    'Info',
    'Last episode',
    'company',
]

const TvShow = ({tvShow}: { tvShow: tvShowType}) => {
    const [showedPanel, setShowedPanel] = useState(INFORMATION_TO_SHOW[0])
    
    const listOFGenres = (): string[] => {

        let ListOfGenres = tvShow.genres.map(a => a.name)
        return ListOfGenres

    }

    const imagePath = (UrlString: string): string => {
        if(UrlString===''){
            return `url(${person})`
        }
        return `url(${UrlString})`
    }

    useEffect(() => {
        document.title = tvShow.name
    }, []);

    const date = (date: string): string =>{
        let dateOfCreation = new Date(date)
        return dateOfCreation.getDate() + "/" + (dateOfCreation.getMonth()+1)+ "/" + dateOfCreation.getFullYear()
    }

    const isShowInProduction = (): string => {
        if(tvShow.inProduction){
            return "yes"
        }
        return "no"
    }

    const changeSelected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, number: number): void => {
        
        let element = e.target as HTMLTextAreaElement
        let selectedCategory = document.getElementById("selected category")
        
        if(selectedCategory){
            element.append(selectedCategory)
        }
        setShowedPanel(INFORMATION_TO_SHOW[number])       
    }


    return (
        <div className="full-movie bigger">
            
            <div className="background-image" style={{backgroundImage: `url(${tvShow.image})`}}></div>
         
            <ActorList actorList={tvShow.actorList}></ActorList>
            <div className="container">
                <h3 style={{marginRight: "1rem"}}>{tvShow.name}</h3>
                <CircleProgressBar rating={tvShow.rating}></CircleProgressBar>
                <div className="center-text">Based on: {tvShow.ratingCount} votes</div>
            </div>
            <div className="cursive">
                {tvShow.tagline}
            </div> 
            <div className="movie-description">
                {tvShow.overview}
            </div>
            <div className="Info-panel">
                <div className="header black top">

                    <div className="selector">
                
                        <div onClick={(e) => changeSelected(e, 0) } className="anchor">
                            <h3>
                                <span  className="no_click">{INFORMATION_TO_SHOW[0]}</span>
                                <div id="selected category" className="background" ></div>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 1) }  className="anchor" >
                            <h3>
                                <span  className="no_click"  >{INFORMATION_TO_SHOW[1]}</span> 
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 2) }  className="anchor" >
                            <h3>
                                <span  className="no_click"  >{INFORMATION_TO_SHOW[2]}</span> 
                            </h3>
                        </div>
                    </div>
                </div>
                { showedPanel === INFORMATION_TO_SHOW[0] ? (
                    <div className="secondary-info">
                        <div> <a target="_blank" href={tvShow.homepage}>Homepage</a>,&nbsp; Original Language: {tvShow.originalLanguage},&nbsp;</div>
                        <div>Number Of Episodes: {tvShow.numberOfEpisodes},&nbsp; Number Of Seasons: {tvShow.numberOfSeasons}</div>
                        <div>Genres: {listOFGenres().join(", ")}</div>
                        <div>Status: {tvShow.status},&nbsp; In production: {isShowInProduction()}</div>
                        <div >Release Date: {tvShow.firstAirDate},&nbsp; Last Episode: {tvShow.lastEpisodeToAir.air_date}</div>
                    </div>
                ): showedPanel === INFORMATION_TO_SHOW[1] ? (
                    <EpisodePreview episode={tvShow.lastEpisodeToAir} number={1}></EpisodePreview>
                ):(
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Logo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tvShow.networks.map((value, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{value.name}</td>
                                            <td>{value.origin_country}</td>
                                            <td><img src={BASE_URL_FOR_IMAGES("w185") + value.logo_path}></img></td>
                                        </tr>
                                    )
                            })}
                        </tbody>
                    </Table>
                )}
            </div>
            <div className="review-list">
                <h3>Reviews:</h3>
                { tvShow.reviews.length > 0 ? (
                    <div className="scrollable">
                
                        <ListGroup className="" as="ol" numbered>
                            
                            {tvShow.reviews.map((value, index) => {
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

export default TvShow