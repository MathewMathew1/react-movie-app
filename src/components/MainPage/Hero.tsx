


import { moviePreviewType } from "../../types/types";


const Hero = ({movie}: { movie: moviePreviewType}) => {
    
    return (
        <div>
            <div className="hero" style={{backgroundImage: `url(${movie.image})`}}>
                <div className="hero-intro">
                    <h1><code>{movie.fullTitle}</code></h1>
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>  
    )      
}

export default Hero

export {}