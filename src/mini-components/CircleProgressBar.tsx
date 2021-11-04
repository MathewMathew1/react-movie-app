

import { useEffect } from "react"

const SCORES = {
    MAXSCORE: 10,
    MAXGREEN: [129, 238, 125],
    MAXRED: [245, 26, 26],
}

const CircleProgressBar  = ({rating, number}: { rating: number, number?: number}): JSX.Element => {
    

    const rotateProgressBar = (): void => {
        let percentRating = rating
        
        if(percentRating>SCORES.MAXSCORE/2){
            let elementToRotate = document.getElementById("left "+number)
            let degreeToRotate = 180
            
            if(elementToRotate){
                elementToRotate.style.transform = `rotate(${degreeToRotate}deg)`
            }
            
            let elementToRotate2 = document.getElementById("right "+number)
            let degreeToRotate2 = 180/(SCORES.MAXSCORE/2)*(percentRating-5)

            if(elementToRotate2){
                elementToRotate2.style.transform = `rotate(${degreeToRotate2}deg)`
            }
            return
        }
        let elementToRotate = document.getElementById("left "+number)
        let degreeToRotate = 180/(SCORES.MAXSCORE/2)*(percentRating)

        if(elementToRotate){
            elementToRotate.style.transform = `rotate(${degreeToRotate}deg)`
        }
        return
    }

    const colorProgressBar = (): void => {
        const ratingNumber = rating
        let percentOfMax = ratingNumber / SCORES.MAXSCORE  

        let r = SCORES.MAXRED[0] - ((SCORES.MAXRED[0]-SCORES.MAXGREEN[0])*percentOfMax)
        let g = SCORES.MAXRED[1] + ((SCORES.MAXGREEN[1]-SCORES.MAXRED[1])*percentOfMax)
        let b = SCORES.MAXRED[2] - ((SCORES.MAXRED[2]-SCORES.MAXGREEN[2])*percentOfMax)


        let leftCircle = document.getElementById("left "+number)
        let rightCircle = document.getElementById("right "+number)
        
        if(leftCircle){
            leftCircle.style.background = `rgb(${r}, ${g}, ${b})`
        }
        if(rightCircle){
            rightCircle.style.background = `rgb(${r}, ${g}, ${b})`;
        }
    }

    useEffect(() => {
        rotateProgressBar()
        colorProgressBar()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="circular">
            <div className="inner"></div>
            <div className="number">{rating}</div>
            <div className="circle" >
                <div className="bar left">
                    <div id={"left "+number} className="progress"></div>
                </div>
                <div className="bar right">
                    <div id={"right "+number} className="progress"></div>
                </div>
            </div>
        </div>
    )      
}

export default CircleProgressBar