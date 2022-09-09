import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //IN react-router-dom v6 "Switch" is replace by Routes

import Navbar from "./components/Navbar";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NoteState from "./context/notes/NoteState";
import Alert   from "./components/Alert";
function App() {
	const [alert, setAlert] = useState(null);
	const showAlert = (message, type) => {
		setAlert({
			msg: message,
			type: type,
		});
		setTimeout(() => {
			setAlert(null);
		}, 1000);
	};
	return (
		<>
			<NoteState>
				<Router>
					<Navbar />
					<Alert alert={alert}/>
					<div className="container">
						<Routes>
							<Route path="/" element={<Home showAlert = {showAlert} />}></Route>
							<Route exact path="/about" element={<About showAlert = {showAlert}/>}></Route>
							<Route exact path="/login" element={<Login showAlert = {showAlert}/>}></Route>
							<Route exact path="/signup" element={<Signup showAlert = {showAlert}/>}></Route>
						</Routes>
					</div>
				</Router>
			</NoteState>
		</>
	);
}

export default App;
