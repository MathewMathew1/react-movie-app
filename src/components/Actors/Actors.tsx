
import { actorInfoType } from "../../types/types"
import MiniMoviePreview from "../Movie/MiniMoviePreview"
import { useState } from "react"


const INFORMATION_TO_SHOW = [
    'Cast',
    'Crew'
]


const Actor = ({actor}: {actor: actorInfoType}): JSX.Element => {
    const [MoviesAs, setMoviesAs] = useState(INFORMATION_TO_SHOW[0])

    const getAge = (secondDate: Date, firstDate: Date): number => {
        
        let age: number = firstDate.getFullYear() - secondDate.getFullYear()
        let monthDifference: number = firstDate.getMonth() - secondDate.getMonth()
        
        let beforeBirthdayInSecondDate: boolean = (monthDifference < 0  || (monthDifference === 0
        && firstDate.getDate() < secondDate.getDate()) )
        if (beforeBirthdayInSecondDate) {
            age--
        }
        return age;
    }


    const LifeStoryFunction = (): string =>{
        let LifeStory = `Born on ${actor.birthDay} at ${actor.placeOfBirth}`

        let birthdayDate: Date = new Date(actor.birthDay)
        if(actor.deathday!==null){
            let deathDate: Date = new Date(actor.deathday)
            LifeStory += `died at age of ${getAge(birthdayDate, deathDate)} on ${actor.deathday}`
        }
        else{
            let today: Date = new Date()
            LifeStory += ` currently ${getAge(birthdayDate, today)} years old`
        }

        return LifeStory
    }

    const changeSelected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, number: number): void => {
        
        let element = e.target as HTMLTextAreaElement
        let selectedCategory = document.getElementById("selected category")
        
        if(selectedCategory){
            element.append(selectedCategory)
        }
        setMoviesAs(INFORMATION_TO_SHOW[number])  
    }

    

    return(
        <div className="person-info bigger">
            
            <div className="person-image-full" style={{backgroundImage: `url(${actor.image})`}}></div>
            <div className="main-content">
                <div className="container">
                    <h3 style={{marginRight: "1rem"}}>{actor.name}</h3>
                </div>
                <div className="movie-description">
                    <div>
                        {actor.biography}
                    </div>
                </div>
            </div>
            <div className="Info-panel">
                <div className="secondary-info no-flex margin-top3">
                    <div>
                        {actor.homepage!==""? <span> <a rel="noreferrer" href={actor.homepage} target="_blank">Homepage</a>,&nbsp;</span>:null} 
                        Known from: {actor.department}
                    </div>
                    <div>Nicknames:&nbsp; 
                        {actor.alsoKnownAs.join(",  ")}
                    </div>
                    <div>{LifeStoryFunction()} </div>

                </div>
            </div>
            <div className="movie-references">
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
                    </div>
                </div>
                { MoviesAs === INFORMATION_TO_SHOW[0] ? (
                    <div className="container-with-scroll">
                        <span>
                            <div className="box">
                                {actor.castPerformance.map((value, index) => {
                                    return(
                                            <MiniMoviePreview key={index} movie={value} number={index} ></MiniMoviePreview>
                                    )
                                })}
                            </div>
                        </span>
                    </div>
                ):(
                    <div className="container-with-scroll">
                        <span >
                            <div className="box">
                                {actor.crewPerformance.map((value, index) => {
                                    return(
                                            <MiniMoviePreview key={index} movie={value} number={index} ></MiniMoviePreview>
                                    )
                                })}
                            </div>
                        </span>
                    </div>
                )}  
            </div>
        </div>
    )
}

export default Actor