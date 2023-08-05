import './App.css';
import HomePage from "./components/MainPage/HomePage";
import MovieSearch from './components/Movie/MovieSearch';
import MovieInfo from './components/Movie/MovieInfo';
import TvShowInfo from './components/TvShow/TvShowInfo';
import ActorInfo from './components/Actors/ActorsInfo';
import { Route, Routes} from "react-router-dom";
import PageNotFound from "./components/NotFound/PageNotFound"
// login
import UserProvider from './UserContext';
import LoginPage from './components/User/Login';
import NavbarComponent from './components/MainPage/NavbarComponent';
import FavoriteMovies from './components/User/FavoriteMovies';
import WatchList from './components/User/WatchList';
import LogoIcon from './LogoIcon.svg'
import SnackbarProvider from './SnackBarContext';
import SnackBars from './components/MainPage/SnackBars';
import { PrivateRoute } from './mini-components/PrivateRoute';

const App = () => {

  return (
    <>
      <SnackbarProvider>
        <UserProvider>
          <SnackBars></SnackBars>
          <NavbarComponent></NavbarComponent>
         
              <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login"
                  element={<LoginPage/>}
                />
                <Route path="/search/movie/:id"
                  element={<MovieInfo/>}
                />
                <Route path="/search/movies"
                  element={<MovieSearch/>}
                />
                <Route path="/search/tvShow/:id"
                  element={<TvShowInfo/>}
                />
                <Route path="/search/actor/:id"
                  element={<ActorInfo/>}
                />
                <Route path="/profile/favorite"
                  element={
                    <PrivateRoute>  
                      <FavoriteMovies/>
                    </PrivateRoute>  
                  }
                />
                <Route path="/profile/watchlist"
                  element={
                    <PrivateRoute>  
                      <WatchList/>
                    </PrivateRoute>  
                  }
                />
                <Route path="/*" element={<PageNotFound/>} /> 
              </Routes>
      
        </UserProvider>
      </SnackbarProvider>
      <div className='footer-page'>
        <img alt={`TMDB`} style={{height: 40, width: 80}} src={LogoIcon}></img>
      </div>
    </>
  );
}

export default App;
