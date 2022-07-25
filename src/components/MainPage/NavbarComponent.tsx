import { useEffect, useState } from "react"
import { Container, FormControl, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { BASE_URL_FOR_IMAGES, BASE_URL_OF_API } from "../../ApiVariables"
import useFetch from "../../customHooks/useFetch"
import { useUserUpdate } from "../../UserContext"
import { camera } from "../../icons/icons"
import { useUser } from "../../UserContext"
import { useUpdateSnackbar } from "../../SnackBarContext"


const DEFAULT_GRAVATAR = '0f516da7f18d3820b0b2e67919867698'

const WAY_OF_SEARCHING = [
    "Search by name",
    'Search by genre'
]
  
const controller = new AbortController() 


const NavbarComponent  = (): JSX.Element => {
    const [wayOfSearching, setWayOfSearching] = useState(WAY_OF_SEARCHING[0])
    const [phraseToSearch, setPhraseToSearch] = useState("")
    const getGenres = useFetch( BASE_URL_OF_API + `/genre/movie/list?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`,{},[], true, 'genres') 
    const user = useUser()
    const userUpdate = useUserUpdate()
    const updateToast = useUpdateSnackbar()

    const searchForMovies = (e: React.KeyboardEvent<object>): void => {
        e.preventDefault()
        let param: string = ''
        if(wayOfSearching===WAY_OF_SEARCHING[0]){
            param = `?name=${phraseToSearch}`
        }
        
        else if(wayOfSearching===WAY_OF_SEARCHING[1]){
        
        let genre: string|undefined
        let id: number|undefined
        
        for(let i=0; i < getGenres.fetchDataStatus.value.genres.length; i++){
            if(getGenres.fetchDataStatus.value.genres[i].name.toLowerCase().includes(phraseToSearch)){
            genre = getGenres.fetchDataStatus.value.genres[i].name
            id = getGenres.fetchDataStatus.value.genres[i].id
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const { signal } = controller
        fetch(BASE_URL_OF_API+`/authentication/session?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&session_id=${user.sessionId}`,{
            method: "DELETE",
            signal,
        })
        .then(response => response.json())
        .then(response => {
            sessionStorage.removeItem("sessionId")
            updateToast.addSnackBar({snackbarText: "Logged out", severity: "success"})
            userUpdate.setLoggedUser('', false) 
        })
        .catch(error=>{
            updateToast.addSnackBar({snackbarText: "Unable to logout, try again", severity: "error"})
            console.log(error)
        })
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
                    
                    { !user.logged===true || user.userInfo ===undefined ? (
                        <Nav.Link onClick={()=>Login()}>Login</Nav.Link>
                    ):(
                        <NavDropdown className="dropdown-without-after" title={
                            <> 
                                {user.userInfo?.avatar.tmdb.avatar_path !== null?
                                    <img alt={user.userInfo.username} className="profile-image" src={BASE_URL_FOR_IMAGES("w92") + user.userInfo?.avatar.tmdb.avatar_path} id="collasible-nav-dropdown"/>
                                :
                                        user.userInfo?.avatar.gravatar.hash !== DEFAULT_GRAVATAR?
                                        <img alt={user.userInfo.username} className="profile-image" src={"http://www.gravatar.com/avatar/" + user.userInfo?.avatar.gravatar.hash}/>
                                    : 
                                        <div className="avatar-circle">{user.userInfo.username[0].toUpperCase()}</div>
                                }
                            </>
                        }>
                            <NavDropdown.Item >{user.userInfo?.username}</NavDropdown.Item>
                            <hr/>
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
        </div>
    )      
}

export default NavbarComponent