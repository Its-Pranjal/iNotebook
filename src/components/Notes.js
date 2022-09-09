import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
	const context = useContext(noteContext);
	const  navigate = useNavigate();
	const { notes, getNotes, editNote } = context;
	useEffect(() => {
		if (localStorage.getItem('token')) {
			getNotes()
		}
		else{
			navigate("/login");	

		}
		
		//eslint-disable-next-line
	}, []);
	const ref = useRef(null);
	const refClose = useRef(null);

	const [note, setNote] = useState({
		id: "",
		etitle: "",
		edescription: "",
		etag: "",
	});

	const updateNote = (currentNote) => {
		ref.current.click();
		setNote({
			id: currentNote._id,
			etitle: currentNote.title,
			edescription: currentNote.description,
			etag: currentNote.tag,
			
		})
		
		//setNote(title: currentNote.title, descriptin: currentNote.description, tag: currentNote.tag)
	}

	const handleClick = (e) => {
		editNote(note.id, note.etitle, note.edescription, note.etag);
		
		refClose.current.click();
		props.showAlert("Updated successfully", "success"); 
		
		//addNote(note.title, note.descriptin, note.tag);
	}
	const onChange = (e) => {
		setNote({ ...note, [e.target.name]: e.target.value });
	};

	return (
		<>
			<AddNote showAlert={props.showAlert}/>

			<button
				ref={ref}
				type="button"
				className="btn btn-primary d-none"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
			>
				Launch demo modal
			</button>

			<div
				className="modal fade"
				id="exampleModal"
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Edit Note
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<form className="container my-3">
								<div className="mb-3">
									<label htmlFor="title" className="form-label">
										Title
									</label>
									<input
										type="text"
										className="form-control"
										id="etitle"
										name="etitle"
										value={note.etitle}
										aria-describedby="emailHelp"
										onChange={onChange} minLength = {5} required
									/>
									<div id="emailHelp" className="form-text"></div>
								</div>
								<div className="mb-3">
									<label htmlFor="description" className="form-label">
										Description
									</label>
									<input
										type="text"
										className="form-control"
										id="edescription"
										name="edescription"
										value={note.edescription}
										onChange={onChange}
									/>
								</div>
								<div className="mb-3">
									<label className="form-check-label" htmlFor="exampleCheck1">
										Tag
									</label>
									<input
										type="text"
										className="form-control"
										id="etag"
										name="etag"
										value={note.etag}
										onChange={onChange}
									/>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button
								ref={refClose}
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button disabled ={ note.etitle.length < 5 || note.edescription.length < 5 }
								onClick={handleClick}
								type="button"
								className="btn btn-primary"
							>
								Update Note
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="row my-3">
				<h1> Your Notes</h1>
				<div className="conainer mx-2">
					{notes.length === 0 && "No Notes to Display"}
				</div>

				{notes.map((note) => {
					return (
						<Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
					);
				})}
			</div>
		</>
	);
};
export default Notes;
