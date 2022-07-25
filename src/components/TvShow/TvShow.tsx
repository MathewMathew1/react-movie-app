
import { tvShowType } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"
import { useEffect, useState } from "react";
import EpisodePreview from "./EpisodePreview";
import {BASE_URL_FOR_IMAGES} from "../../ApiVariables"
import { Table } from "react-bootstrap";
import ActorList from "../Actors/ActorList";
import ReviewList from "../Reviews/ReviewList";
import RatingMovie from "../../mini-components/RatingMovie";

const INFORMATION_TO_SHOW = [
    'Info',
    'Last episode',
    'company',
]

const TvShow = ({tvShow}: { tvShow: tvShowType}): JSX.Element => {
    const [showedPanel, setShowedPanel] = useState(INFORMATION_TO_SHOW[0])
    
    const listOFGenres = (): string[] => {

        let ListOfGenres = tvShow.genres.map(a => a.name)
        return ListOfGenres

    }

    useEffect(() => {
        document.title = tvShow.name
    }, [tvShow.name]);

    const isShowInProduction = (): boolean => {
        if(tvShow.inProduction){
            return true
        }
        return false
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
            <div style={{position: "relative"}}>
                <div className="imageContainer" style={{display: "flex", justifyContent: "center"}}>
                    <a target={"_blank"} rel="noreferrer" href={tvShow.image} >
                        <img alt={tvShow.name} src={`${tvShow.image}`} className="movie-image"></img>
                    </a>
                </div>
                <RatingMovie id={tvShow.id} mediaType={"tv"}></RatingMovie>
            </div>
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
                                <span className="no_click">{INFORMATION_TO_SHOW[0]}</span>
                                <div id="selected category" className="background" ></div>
                            </h3>
                        </div>
                        <div onClick={(e) => changeSelected(e, 1) }  className="anchor" >
                            <h3>
                                <span className="no_click"  >{INFORMATION_TO_SHOW[1]}</span> 
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
                        <div> 
                            <a rel="noreferrer" target="_blank" href={tvShow.homepage}>Homepage</a>,&nbsp; 
                            Original Language: {tvShow.originalLanguage},&nbsp;
                        </div>
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
                                        <td><img alt={value.name} src={BASE_URL_FOR_IMAGES("w185") + value.logo_path}></img></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </div>
            <ReviewList reviews={tvShow.reviews}></ReviewList>
        </div>  
    )      
}

export default TvShow