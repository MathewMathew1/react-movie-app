
import ListTemplate from "./ListTemplate"


const FavoriteMovies = (): JSX.Element => {

    return(
        <div>
            <ListTemplate dataToFetch={"favorite"}></ListTemplate>
        </div>
    )
}

export default FavoriteMovies