import { useEffect, useRef, useState } from "react"
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
    const [hideAutoComplete, setHideAutoComplete] = useState(false) 
    const [currentActiveSuggestion, setCurrentActiveSuggestion] = useState<null|number>(null)
    const [possibleSuggestions, setPossibleSuggestions] = useState([])
    const autoSuggestionContainer = useRef()

    const getGenres = useFetch( BASE_URL_OF_API + `/genre/movie/list?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`,{},[], true, 'genres') 
    
    const user = useUser()
    const userUpdate = useUserUpdate()
    const updateToast = useUpdateSnackbar()

    useEffect(() => {
        userUpdate.fetchAllData()
        
        return () => {
          controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const checkForPossibleSuggestions = wayOfSearching===WAY_OF_SEARCHING[0] || getGenres.fetchDataStatus.loading===true 
            || phraseToSearch.length < 1
        if(checkForPossibleSuggestions) {
            setPossibleSuggestions([])
            return
        }
        
        let genres: {id: number, name: string}[] = getGenres.fetchDataStatus.value.genres
        let newPossibleSuggestions: string[] = []

        for(let i=0;i<genres.length; i++){
            if(genres[i].name.toLocaleLowerCase().includes(phraseToSearch)){
                newPossibleSuggestions.push(genres[i].name)
            }
        }
        
        setHideAutoComplete(false)
        setCurrentActiveSuggestion(null)
        setPossibleSuggestions(newPossibleSuggestions)
    }, [phraseToSearch, wayOfSearching]);

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

                if(getGenres.fetchDataStatus.value.genres[i].name.toLowerCase().includes(phraseToSearch.toLowerCase())){
                    genre = getGenres.fetchDataStatus.value.genres[i].name
                    id = getGenres.fetchDataStatus.value.genres[i].id
                    
                }
            }
            if(id === undefined){
                return
            }
            param = `?genre_id=${id}`
        }
        console.log("/search/movies" + param + "&page=1")
        window.location.href = "/search/movies" + param + "&page=1"

    }

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
        if(event.key === 'Enter' && currentActiveSuggestion !== null){
            setPhraseToSearch(possibleSuggestions[currentActiveSuggestion])
            setCurrentActiveSuggestion(null)
            setHideAutoComplete(true)
            return
        }

        if (event.key === 'Escape'){
            setCurrentActiveSuggestion(null)
            setHideAutoComplete(true)
            return
        }

        if (event.key === 'Enter'){
            searchForMovies(event)
            return
        }

        if(wayOfSearching===WAY_OF_SEARCHING[0]) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {

            let changeOfActive = event.key === 'ArrowDown'? 1: -1
            
            let element = document.getElementById(`${currentActiveSuggestion} suggestion`)
            if(element){
                element.classList.remove("active")
            }
            
            let numberOfNewElement

            if(currentActiveSuggestion===null){
                numberOfNewElement = changeOfActive === 1? 0: null 
            }
            else if(currentActiveSuggestion===possibleSuggestions.length-1 && changeOfActive===1){
                numberOfNewElement = 0
            }
            else if(currentActiveSuggestion===0 && changeOfActive===-1){
                numberOfNewElement = possibleSuggestions.length-1
            }
            else{
                numberOfNewElement = currentActiveSuggestion + changeOfActive
            }

            setCurrentActiveSuggestion(numberOfNewElement)
            let newActiveElement = document.getElementById(`${numberOfNewElement} suggestion`)
            if(newActiveElement){
               
                newActiveElement.focus()
                newActiveElement.classList.add("active")
            }
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
            if(response.error){
                updateToast.addSnackBar({snackbarText: "Unable to logout, try again", severity: "error"})
                return
            }

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
                        <div>
                            <FormControl onKeyDown={handleKeypress} className="search" placeholder='Search' aria-label="Text input with dropdown button"
                                style={{borderRadius: "0px"}} 
                                value={phraseToSearch} autoComplete={"ccccc"} onChange={(e) => setPhraseToSearch(e.target.value.toLowerCase())} />
                            <div className="relative">
                                {!hideAutoComplete?
                                    <div className="autocomplete" ref={autoSuggestionContainer} >
                                        {possibleSuggestions.map((value, index) => {
                                            return(
                                                <div id={`${index} suggestion`} className="autocomplete-items" key={`${index} suggestion`} onClick={()=>{
                                                    setPhraseToSearch(value)
                                                    setHideAutoComplete(true)
                                                }}>
                                                    {value}    
                                                </div>                             
                                            )
                                        })}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>

                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </div>
    )      
}

export default NavbarComponent