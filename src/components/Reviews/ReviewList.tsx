
import { ListGroup } from "react-bootstrap"
import RatingLabel from "../../mini-components/RatingLabel"
import person from "../../person.png"
import { movieReview } from "../../types/types"

const ReviewList = ({reviews}: { reviews: movieReview[]}): JSX.Element => {
    const imagePath = (UrlString: string): string => {
        if(UrlString===''){
            return `url(${person})`
        }
        return `url(${UrlString})`
    }

    const date = (date: string): string =>{
        let dateOfCreation = new Date(date)
        return dateOfCreation.getDate() + "/" + (dateOfCreation.getMonth()+1)+ "/" + dateOfCreation.getFullYear()
    }
    
    return(
        <div className="review-list">
      
        <div >
  
            <h3>Reviews</h3>
            { reviews.length > 0 ? (
                <div className="scrollable">
                    <ListGroup className="" as="ol" numbered>
                        
                        {reviews.map((value, index) => {
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

export default ReviewList
