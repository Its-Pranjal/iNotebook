import React,{useState} from "react";
import { useNavigate } from "react-router-dom"

const Login = (props) => {
  const [credentials, setCredentials] = useState({email:"", password:""})
  const  navigate = useNavigate();
  //const [password, setPassword] = useState("")
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
      },
      body: JSON.stringify({email: credentials.email, password: credentials.password})
		});
    const json = await response.json()
    console.log(json);
    if (json.success){
      //save the uth token and edirect
      localStorage.setItem('token', json.authtoken); 
        //useHistory is replaced by useNavigate m v6
		props.showAlert("successfully Logged in", "success")
		navigate("/");
	  
    }
    else{
		props.showAlert("Invalid credentials", "danger")
    }

  }
  const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	return (
		<div className="mt-3">
			<h2>Log in to iNotebook</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						<h5>Email address</h5>
					</label>
					<input
						type="email"
						className="form-control" value={credentials.email} onChange = {onChange}
						id="email" name="email"
						aria-describedby="emailHelp"
					/>
					
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						<h5>Password</h5>
					</label>
					<input
						type="password"
						className="form-control" value={credentials.password} onChange = {onChange}
						id="password" name="password"
					/>
				</div>

				<button type="submit" className="btn btn-primary"  >
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
