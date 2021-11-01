

import { useEffect } from "react"

const SCORES = {
    MAXSCORE: 10,
    MAXGREEN: [129, 238, 125],
    MAXRED: [245, 26, 26],
}

const RatingLabel  = ({rating, number}: { rating: number, number?: number}) => {
    console.log(rating)

    const colorProgressBar = (): void => {
        const ratingNumber = rating
        let percentOfMax = ratingNumber / SCORES.MAXSCORE  

        let r = SCORES.MAXRED[0] - ((SCORES.MAXRED[0]-SCORES.MAXGREEN[0])*percentOfMax)
        let g = SCORES.MAXRED[1] + ((SCORES.MAXGREEN[1]-SCORES.MAXRED[1])*percentOfMax)
        let b = SCORES.MAXRED[2] - ((SCORES.MAXRED[2]-SCORES.MAXGREEN[2])*percentOfMax)


        let square = document.getElementById("square "+number)

        if(square){
            square.style.background = `rgb(${r}, ${g}, ${b})`
        }
    }

    useEffect(() => {

        colorProgressBar()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="square-rating-bar" id={'square '+number}>
            <div className="number">{rating}</div>
        </div>
    )      
}

export default RatingLabel