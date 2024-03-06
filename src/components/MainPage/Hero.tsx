import movieBackground from "../../movieBackground.png"
import { moviePreviewType } from "../../types/types";


const Hero = ({movie}: { movie: moviePreviewType}): JSX.Element => {
    
    return (
        <div>
            <div className="hero" style={{backgroundImage: `url(${movieBackground})` }}>
                <img className="hero-image" src={movie.image}/>
                   
                <div className="hero-intro">
                    <h1><code>{movie.fullTitle}</code></h1>
                    <p className="hide-on-very-small-screen" >{movie.overview}</p>
                </div>
            </div>
        </div>  
    )      
}

export default Hero

export {}