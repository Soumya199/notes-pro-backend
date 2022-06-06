const express = require("express");
const fetchUser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Route1: Get all the notes using : GET "/api/notes/fetchallnotes". No Login Require
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Notes.find({ user: userId });
    res.json(notes);
  } catch (error) {
    res.status(500).send("internal server error occured");
    console.log(error.message);
  }
});
//Route2: Add a new Notes using  : POST "/api/notes/addnote". Login Require
router.post(
  "/addnote",
  fetchUser,
  body("title", "enter a valid title").isLength({ min: 3 }),
  body(
    "description",
    "description must be atleast 5 charecter and max 255 character"
  ).isLength({ min: 5, max: 255 }),
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there are errors , return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("internal server error occured");
      console.log(error.message);
    }
  }
);

//Route2:Update an existing Note using  : PUT "/api/notes/updatenote/:id". Login Require
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try{
  const { title, description, tag } = req.body;
  //Create a new Notes object
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

  //Find the Note to be updated and updtae it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("not Allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
} catch (error) {
  res.status(500).send("internal server error occured");
  console.log(error.message);
}
});

//Route3:Delete an existing Note using  : DELETE "/api/notes/deletenote/:id". Login Require
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //Find the Note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "notedeleted successfully" });
  } catch (error) {
    res.status(500).send("internal server error occured");
    console.log(error.message);
  }
});

module.exports = router;
