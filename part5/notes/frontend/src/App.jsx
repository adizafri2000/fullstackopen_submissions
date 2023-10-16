import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login.jsx'
import LoginForm from "./components/LoginForm.jsx"
import NoteForm from "./components/NoteForm.jsx";
import Togglable from "./components/Togglable.jsx";
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
    const [loginVisible, setLoginVisible] = useState(false)
    const [notes, setNotes] = useState(null)
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const noteFormRef = useRef()

    useEffect(() => {
        noteService
        .getAll()
        .then(initialNotes => {
        setNotes(initialNotes)
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    if (!notes) {
        return null
    }

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                setErrorMessage(`Note '${note.content}' was already removed from server`)

                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)

                setNotes(notes.filter(n => n.id !== id))
            })
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important === true)

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            // save user login token to local storage
            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            )

            // set user token for note services esp. note creation
            noteService.setToken(user.token)

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' }
        const showWhenVisible = { display: loginVisible ? '' : 'none' }

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>log in</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        )
    }

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
            })
    }

    const noteForm = () => (
        <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={addNote} />
        </Togglable>
    )

    const logoutHandler = () => {
        window.localStorage.removeItem('loggedNoteappUser')
        window.location.reload()
    }

    return (
        <div>
            <h1>Notes</h1>
            { (errorMessage) && <Notification message={errorMessage} /> }

            {/*if user state is null (no user logged in), display login form*/}
            {!user && loginForm()}

            {/*if a user has logged in (user state not null), display name and create new note form*/}
            {user && <div>
                <p>{user.name} logged in</p>
                <button onClick={logoutHandler}>logout</button>
                {noteForm()}
            </div>
            }

            {/*toggle to show all/important notes*/}
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>

            {/*list notes*/}
            <ul>
                {notesToShow.map(note =>
                <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
                )}
            </ul>

            <Footer />
        </div>
    )
}

export default App 