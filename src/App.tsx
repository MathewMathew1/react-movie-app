


import './App.css';
import HomePage from "./components/MainPage/HomePage";
import MovieSearch from './components/Movie/MovieSearch';
import MovieInfo from './components/Movie/MovieInfo';
import TvShowInfo from './components/TvShow/TvShowInfo';
import ActorInfo from './components/Actors/ActorsInfo';
import { Switch, Route} from "react-router-dom";
import { InputGroup, SplitButton, Dropdown, FormControl, Navbar, Container, Nav} from 'react-bootstrap';
import { useState } from 'react';
import useFetch from './customHooks/useFetch';
import { BASE_URL_OF_API } from './ApiVariables';
import pageNotFound from "./components/NotFound/PageNotFound"


const WAY_OF_SEARCHING = [
  "Search by name",
  'Search by genre'
]

const controller = new AbortController() 

const App = (props: any) => {

  const [wayOfSearching, setWayOfSearching] = useState(WAY_OF_SEARCHING[0])
  const [phraseToSearch, setPhraseToSearch] = useState("")
  const getGenres = useFetch( BASE_URL_OF_API + `/genre/movie/list?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`,{},[], true, 'genres') 

  const searchForMovies = (e: React.KeyboardEvent<object>): void => {
    
    e.preventDefault()
    let param: string = ''
    if(wayOfSearching===WAY_OF_SEARCHING[0]){
       param = `?name=${phraseToSearch}`
    }
    
    else if(wayOfSearching===WAY_OF_SEARCHING[1]){
      console.log(getGenres)
      
      let genre: string|undefined
      let id: number|undefined
      
      for(let i=0; i < getGenres.fetchDataStatus.value.genres.length; i++){
        if(getGenres.fetchDataStatus.value.genres[i].name.toLowerCase().includes(phraseToSearch)){
          genre = getGenres.fetchDataStatus.value.genres[i].name
          id = getGenres.fetchDataStatus.value.genres[i].id
          console.log(getGenres.fetchDataStatus.value.genres[i])
        }
      }
      if(genre === undefined){
        return
      }
      param = `?genre_id=${id}`
    }
    
    window.location.href = "/search/movies" + param + "&page=1"

  }

  const getSession = async(): Promise<void> => {
    const { signal } = controller
    const body = {
      request_token: "f0d4c8a88341760a532c6679e3f1108395a99ce4"
    }
    await fetch(BASE_URL_OF_API+'/authentication/session/new?api_key=054d81c0a2132b241e5db5c64009ef65',{
        method: "POST",
        body: JSON.stringify(body),
        signal,
      })
      .then(response => response.json())
      .then(response => {
          console.log(response)
          return
      })
      .catch(error=>{console.log(error)})

  }

  const Login = async () => {
    await getSession()
    /*window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:3000/`
    console.log('s')*/
  }

  

  const handleKeypress = (event: React.KeyboardEvent<object>): void => {
    //it triggers by pressing the enter key
    
    if (event.key === 'Enter') {
      searchForMovies(event)
    }
  }

  return (
    <div >
      <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">MovieApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
          </Nav>
          <Nav.Link onClick={()=>Login()}>Login</Nav.Link>
          <InputGroup onKeyDown={handleKeypress} className="search">
            <SplitButton
              variant="primary"
              title={wayOfSearching}
              id="segmented-button-dropdown-1"
            >
              <Dropdown.Item onClick={() => setWayOfSearching(WAY_OF_SEARCHING[0])} href="#">{WAY_OF_SEARCHING[0]}</Dropdown.Item>
              <Dropdown.Item onClick={() => setWayOfSearching(WAY_OF_SEARCHING[1])} href="#">{WAY_OF_SEARCHING[1]}</Dropdown.Item>
            </SplitButton>
            <FormControl placeholder='Search' aria-label="Text input with dropdown button" value={phraseToSearch} 
              onChange={(e) => setPhraseToSearch(e.target.value.toLowerCase())} />
              

          </InputGroup>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        
      <header className="App-header">
        <Switch>
          <Route exact path="/">
            <HomePage></HomePage>
          </Route>
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
          <Route path="*" component={pageNotFound} />
        </Switch>
        
      </header>

      
    </div>
  );
}

export default App;
