import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
	const host = "http://localhost:5000";
	const notesInitial = [];

	const [notes, setNotes] = useState(notesInitial);

	//get all note

	const getNotes = async () => {
		//TO DO API CALL
		const response = await fetch(`${host}/api/notes/fetchallnotes`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"auth-token": localStorage.getItem('token')	}
		});
		const json = await response.json();
		setNotes(json)
	};

	//Add a note
	const addNote = async (title, description, tag) => {
		//TO DO API CALL
		const response = await fetch(`${host}/api/notes/addnote/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token":
					localStorage.getItem('token')			},
			body: JSON.stringify({ title, description, tag })
		});
		const note = await response.json();
		setNotes(notes.concat(note));
		
		
	}

	//Delete a note

	const deleteNote = async (id) => {
		//MAKE API CALL
		const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"auth-token":
				localStorage.getItem('token')}
		});
		const json = await response.json();
		console.log(json)

		
		const newNote = notes.filter((note) => {
			return note._id !== id;
		});
		setNotes(newNote);
	};

	//Edit  NOTE
	const editNote = async (id, title, description, tag) => {
		//API  CALL
		const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"auth-token": localStorage.getItem('token')			},
			body: JSON.stringify({ title, description, tag })
		});
		const json =  await response.json();
		console.log(json)

		let nweNotes = JSON.parse(JSON.stringify(notes))

		//LOGIC TO EDIT IN CLIENT
		for (let index = 0; index < nweNotes.length; index++) {
			const element = notes[index];
			if (element._id === id) {
				nweNotes[index].title = title;
				nweNotes[index].description = description;
				nweNotes[index].tag = tag;
				//break;
			}
			
		}
		setNotes(nweNotes);
	};

	return (
		<NoteContext.Provider
			value={{ notes, addNote, deleteNote,  getNotes,editNote }}
		>
			{props.children}
		</NoteContext.Provider>
	);
};

export default NoteState;
