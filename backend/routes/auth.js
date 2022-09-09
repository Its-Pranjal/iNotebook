const express = require("express");
const User = require("../models/User");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRECT = "@LOLO$BABA";
//ROUTE 1 Create a User usng: POST "/api/auth/createuser". Dosen't  require authentiction
router.post(
	"/createuser",
	[
		body("name", "Enter a valid name").isLength({ min: 2 }),
		body("email", "Enter a valid e-mail").isEmail(),
		body("password", "password length atleast of lngth 5").isLength({ min: 5 }),
	],
	async (req, res) => {
		let success = false;
		//if there are any error, return bad request
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({success, errors: errors.array() });
		}
		//check whether the user with  this email exit already or not
		try {
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res
					.status(400)
					.json({success, error: "Sorry the user with this email already exist" });
			}
			const salt = await bcrypt.genSalt(10);
			const secPass = await bcrypt.hash(req.body.password, salt);

			//create a new user
			user = await User.create({
				name: req.body.name,
				password: secPass,
				email: req.body.email,
			});
			const data = {
				user: {
					id: user.id,
				},
			};
			const authtoken = jwt.sign(data, JWT_SECRECT);
			//console.log(authtoken);
			success = true;
			res.json({success, authtoken });
			//res.json(user);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal server  error occured");
		}
	}
);

//ROUTE 2 Authenticate a user : POST "/api/auth/login". Dosen't  require login
router.post(
	"/login",
	[
		body("email", "Enter a valid e-mail").isEmail(),
		body("password", "Password can not be blank").exists(),
	],async (req, res) => {
		let success = false;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				success =false;
				return res
					.status(400)
					.json({ error: "Please write correct credentials" });
			}

			console.log(password, user.password)
			const passwordcompare = await bcrypt.compare(password, user.password);
			if (!passwordcompare) {
				success =false;
				return res
					.status(400)
					.json({success, error: "Please write correct credentials" });
			}
			const data = {
				user: {
					id: user.id,
				},
			};
			const authtoken = jwt.sign(data, JWT_SECRECT);
			success = true;
			res.json({success, authtoken });
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal server  error occured");
		}
	}
);

//ROUTE 3 Get loggedin  user detail using POST REQUEST "/api/auth/getuser". login required

router.post("/getuser", fetchuser, async (req, res) => {
	
	try {
		userId = req.user.id;
		const user = await User.findById(userId).select("-password")    //we need to check this and route 3 as well as 
		
		res.send(user)
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal server  error occured");
	}
})

module.exports = router  
