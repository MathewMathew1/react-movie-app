const BASE_URL_OF_API =  "https://api.themoviedb.org/3"

const BASE_URL_FOR_IMAGES = (size="original") =>{
    return `https://image.tmdb.org/t/p/${size}/`
}


export {BASE_URL_OF_API, BASE_URL_FOR_IMAGES}