import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
	const [credentials, setCredentials] = useState({
		name: "",
		email: "",
		password: "",
		cpassword:"",
		
	})
	let navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const {name, email, password} = credentials;
		const response = await fetch("http://localhost:5000/api/auth/createuser", {
			
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name, email, password
			}),
		});
		const json = await response.json();
		console.log(json);
		if (json.success) {
			//save the uth token and edirect
			localStorage.setItem("token", json.authtoken);
			//useHistory is replaced by useNavigate m v6
			navigate("/");
			props.showAlert("Account Created successfully ", "success")
		} else {
			props.showAlert("Invalid credentials", "danger")
		}
	};
	const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};
	return (
		<div className="container mt-3">
			<h2>Create Account to use iNotebook</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Name
					</label>
					<input
						type="text"
						className="form-control"
						id="name"
						name="name"
						onChange={onChange} minLength = {5} required
						aria-describedby="emailHelp"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						name="email"
						onChange={onChange}  minLength = {5} required
						aria-describedby="emailHelp"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="password"
						name="password"
						onChange={onChange}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="cpassword" className="form-label">
						Confirm Password
					</label>
					<input
						type="password"
						className="form-control"
						id="cpassword"
						name="cpassword"
					/>
				</div>

				<button type="submit" className="btn btn-primary">
					Signup
				</button>
			</form>
		</div>
	);
};

export default Signup;
