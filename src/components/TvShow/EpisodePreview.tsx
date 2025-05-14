
import { Card, Button } from "react-bootstrap"
import { episode } from "../../types/types";
import CircleProgressBar from "../../mini-components/CircleProgressBar"

const VAR = {
    LENGTH_OF_DESCRIPTION: 200
}

const EpisodePreview = ({episode, number}: { episode: episode, number: number}): JSX.Element => {
    
    console.log(episode)

    const partOfDescription = (): string => {
        return episode.overview.substring(0, VAR.LENGTH_OF_DESCRIPTION)+ "..."
    }

    return (
        <div className="episode-preview">
            <Card className="whole-height episode-preview-card" style={{overflow: "auto", height: "18rem"}} >
                <div className="container">
                    <img className="rescaled-image" loading="lazy"  
                    alt={episode.name}  width="200px"   
                    src={episode.image}  ></img>
                
                
                    <Card.Title className="margin-right">{episode.name}</Card.Title>
                    <CircleProgressBar rating={episode.voteAverage} number={number}></CircleProgressBar>
                    <div className="center-text">{episode.voteCount} votes</div>
                </div>
                <Card.Body className="episode-preview-body">
                    
                    <Card.Text>
                        {partOfDescription()}
                    </Card.Text>
                    <div >Release Date: {episode.air_date}</div>
                    <Button as="a" href={'/search/tvEpisode?id=' + episode.id} variant="primary">More info</Button>
                </Card.Body>               
            </Card>
        </div>  
    )      
}

export default EpisodePreview