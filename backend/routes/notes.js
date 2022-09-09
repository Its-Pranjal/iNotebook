const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1 Get all the notes using GET REQUEST "/api/notes/getuser". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		res.json(notes)
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal server  error occured");
	}
});

//Route 2 Add a new notes using POST Request  "api/notes/addnote" .Login required
router.post(
	"/addnote",
	fetchuser,
	[
		body("title", "Enter a valid title").isLength({ min: 2 }),

		body(
			"description",
			"Description length must be atleast 5 character"
		).isLength({ min: 5 }),
	],
	async (req, res) => {
		try {
			const { title, description, tag } = req.body;
			//if there are any error, return bad request
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			const note = new Note({
				title,
				description,
				tag,
				user: req.user.id,
			});
			const savedNote = await note.save();

			res.json(savedNote);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal server  error occured");
		}
	}
);

//ROUTE 3 Update exicting notes in database by using PUT RREQEST  "api/notes/updatenote". Logi is required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
	const { title, description, tag } = req.body;
	try {
		//create a newNote object
		const newNote = {};
		if (title) {
			newNote.title = title;
		}
		if (description) {
			newNote.description = description;
		}
		if (tag) {
			newNote.tag = tag;
		}

		//Find a note to be updated to update it

		let note = await Note.findById(req.params.id);
		if (!note) {
			
			return res.status(404).send("Not Found ");
		}
		if (note.user.toString() !== req.user.id) {
			
			return res.status(401).send("Not Allowed");
		}
		note = await Note.findByIdAndUpdate(
			req.params.id,
			{ $set: newNote },
			{ new: true }
		);
		res.json({ note });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal server  error occured");
	}
});
//ROUTE 4 Delete an   exicting notes in database by using DELETE RREQEST  "api/notes/deletenote ". Logi is required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
	const {title, description, tag}  = req.body;
	try {
		//Find a note to be deleted to delete it

		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).send("Not Found ");
		}
		//allow to delete f user owns this notes
		if (note.user.toString() !== req.user.id) {
			return res.status(401).send("Not Allowed");
		}
		note = await Note.findByIdAndDelete( req.params.id )	
		res.json({ SUCCESS: "Note has been deleted", note: note });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal server  error occured");
	}
});

module.exports = router;
