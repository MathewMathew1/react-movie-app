
import { actorType } from "../../types/types";
import { ListGroup } from "react-bootstrap";
import person from "../../person.png"

const ActorList = ({actorList}: {actorList: actorType[]}): JSX.Element => {
    
    const imagePath = (UrlString: string): string => {
        if(UrlString===''){
            return `url(${person})`
        }
        return `url(${UrlString})`
    }
    
    return(
        <div className="actor-list">
            <h3>List of actors:</h3>
            <div className="scrollable">
                <ListGroup className="" as="ol" numbered>
                    {actorList.map((value, index) => {
                        return(
                            <ListGroup.Item key={index} as="li"className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{value.name}</div>
                                
                                </div>
                                <a href={'/search/actor/' + value.id}>
                                    <div className="icon" style={{backgroundImage: imagePath(value.image)}}></div>
                                </a>
                            </ListGroup.Item>                               
                        )
                    })}    
                </ListGroup>
            </div>    
        </div>
    )
}

export default ActorList