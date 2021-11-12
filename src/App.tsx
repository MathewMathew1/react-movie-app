


import './App.css';
import HomePage from "./components/MainPage/HomePage";
import MovieSearch from './components/Movie/MovieSearch';
import MovieInfo from './components/Movie/MovieInfo';
import TvShowInfo from './components/TvShow/TvShowInfo';
import ActorInfo from './components/Actors/ActorsInfo';
import { Switch, Route} from "react-router-dom";
import pageNotFound from "./components/NotFound/PageNotFound"
// login
import UserProvider from './UserContext';
import LoginPage from './components/User/Login';
import NavbarComponent from './components/MainPage/NavbarComponent';
import FavoriteMovies from './components/User/FavoriteMovies';
import WatchList from './components/User/WatchList';

const string = "ss"
export {string}

const App = () => {


  return (
    <div >
      <UserProvider>
        <NavbarComponent></NavbarComponent>
        <div>       
          <Switch>
            <Route exact path="/">
              <HomePage></HomePage>
            </Route>
            <Route path="/login"
              render={(props) => (
                  <LoginPage {...props}/>
              )}
            />
            <Route path="/search/movie"
              render={(props) => (
                  <MovieInfo {...props} />
              )}
            />
            <Route path="/search/movies"
              render={(props) => (
                  <MovieSearch {...props} />
              )}
            />
            <Route path="/search/tvShow"
              render={(props) => (
                  <TvShowInfo {...props} />
              )}
            />
            <Route path="/search/actor"
              render={(props) => (
                  <ActorInfo {...props} />
              )}
            />
            <Route path="/profile/favorite"
              render={() => (
                  <FavoriteMovies />
              )}
            />
            <Route path="/profile/watchlist"
              render={() => (
                  <WatchList />
              )}
            />
            <Route path="*" component={pageNotFound} />
            
          </Switch>

        </div>
      </UserProvider>
      
    </div>
  );
}

export default App;
