import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    //set initial value to whatever is save in localstorage with specific key or empty arr
    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState((notes[0] && notes[0].id) || "")
    const [darkMode, setDarkMode] = React.useState(false)
    
    //Using useEffect to cope with Side-Effect of accessing Local Storage
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    //Adds another note to Notes list, and sets random generated Nanoid id as ID
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    //Updates body of Notes and Puts the most recently-modified note at the top
    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }
         
    //Deletes a note from list
    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }
    
    //Gets currenttly focused Note Id
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    function toggleDarkMode(){
        setDarkMode(prevMode => !prevMode)
    }

    return (
        <main>
        {
            notes.length > 0 ?
            <Split             
                sizes={[20, 80]} 
                direction="horizontal" 
                className="split"
            >
            <Sidebar
                darkMode={darkMode}
                notes={notes}
                currentNote={findCurrentNote()}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
                deleteNote={deleteNote}
            />
            {
                currentNoteId && notes.length > 0 &&
                    <Editor 
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
            }
            </Split> :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>                       
        }
        </main>
    )
}
