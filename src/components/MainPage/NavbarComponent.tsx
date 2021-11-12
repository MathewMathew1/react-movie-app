import { useEffect, useState } from "react"
import { Container, FormControl, Nav, Navbar, Toast, NavDropdown } from "react-bootstrap"
import { BASE_URL_OF_API } from "../../ApiVariables"

import useFetch from "../../customHooks/useFetch"
import { useUserUpdate } from "../../UserContext"
import { camera } from "../../icons/icons"
import { useUser } from "../../UserContext"


const WAY_OF_SEARCHING = [
    "Search by name",
    'Search by genre'
]
  
const controller = new AbortController() 


const NavbarComponent  = (): JSX.Element => {

    const [showToast, setShowToast] = useState(false)
    const [wayOfSearching, setWayOfSearching] = useState(WAY_OF_SEARCHING[0])
    const [phraseToSearch, setPhraseToSearch] = useState("")
    const getGenres = useFetch( BASE_URL_OF_API + `/genre/movie/list?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`,{},[], true, 'genres') 
    const user = useUser()
    const userUpdate = useUserUpdate()

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


    useEffect(() => {
     
        userUpdate.fetchAllData()
        
        return () => {
          controller.abort()
        }
    }, []);

    const Login = async () => {
        let token: string = await getToken()
        let baseUrl = window.location.origin
        window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${baseUrl}/login`
    }

    const getToken = async (): Promise<string> => {
        let token: string
        const { signal } = controller
        await fetch(BASE_URL_OF_API+`/authentication/token/new?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}`,{
            method: "GET",
            signal,
        })
        .then(response => response.json())
        .then(response => {
            
            token = response.request_token
            return
        })
        .catch(error=>{console.log(error)})
        return token
    }

    const handleKeypress = (event: React.KeyboardEvent<object>): void => {
        //it triggers by pressing the enter key
        
        if (event.key === 'Enter') {
            searchForMovies(event)
        }
    }


    const Logout = () => {
        
        setShowToast(true)
        const { signal } = controller
        fetch(BASE_URL_OF_API+`/authentication/session?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
            method: "DELETE",
            signal,
        })
        .then(response => response.json())
        .then(response => {
        console.log(response)
        })
        .catch(error=>{console.log(error)})
        userUpdate.setLoggedUser('', false)   
        
    }

 
    
    return (
        <div >
            <Navbar expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand className="font-title" href="/">{camera()} MovieApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                <Nav 
                    className="me-auto my-2 my-lg-0 align-right-content"
                    style={{ maxHeight: '100px'}}
                    navbarScroll
                    >
                
                    { !user.logged===true ? (
                        <Nav.Link onClick={()=>Login()}>Login</Nav.Link>
                    ):(
                        <NavDropdown style={{backgroundImage: `url()`}} title={user.userInfo?.username} id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/profile/favorite" >Favorite</NavDropdown.Item>
                            <NavDropdown.Item href="/profile/watchlist" >WatchList</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => Logout()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    )}

                        <NavDropdown style={{backgroundImage: `url()`}} title={wayOfSearching} id="collasible-nav-dropdown">
                            <NavDropdown.Item onClick={() => setWayOfSearching(WAY_OF_SEARCHING[0])} >
                                {WAY_OF_SEARCHING[0]}
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setWayOfSearching(WAY_OF_SEARCHING[1])}  >
                                {WAY_OF_SEARCHING[1]}
                            </NavDropdown.Item>
                        </NavDropdown>

                        <FormControl onKeyDown={handleKeypress} className="search" placeholder='Search' aria-label="Text input with dropdown button" value={phraseToSearch} 
                            onChange={(e) => setPhraseToSearch(e.target.value.toLowerCase())} />

                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>

            <Toast className="toast" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Body>You have logged out successfully</Toast.Body>
            </Toast>
        </div>
    )      
}

export default NavbarComponent