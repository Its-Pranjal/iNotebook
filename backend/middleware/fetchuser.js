var jwt = require("jsonwebtoken"); //we need to check this and route 3 as well as

const JWT_SECRET = "@LOLO$BABA";

const fetchuser = (req, res, next) => {
	//Get The User from the jwt token and add id to req object
    
	const token = req.header("auth-token");
	if (!token) {
		res.status(401).send({ error: "token is not correct" });
	}
	try {
		const data = jwt.verify(token, JWT_SECRET);
        
		req.user = data.user;

        
		next();
	} catch (error) {
		res
			.status(401)
			.send({ error: "Please authenticate with valid credentials" });
	}
};

module.exports = fetchuser;
