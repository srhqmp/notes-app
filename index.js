require("dotenv").config();
const express = require("express");
const app = express();

const morganBody = require("morgan-body");
morganBody(app);

app.use(express.static("build"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const Note = require("./models/note");

//   GET all notes
app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((notes) => {
      res.json(notes);
    })
    .catch((err) => next(err));
});

//   GET specific note
app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// DELETE specific note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

// POST new note
app.post("/api/notes/", (req, res, next) => {
  const note = req.body;

  if (!note.content) {
    return res.status(400).json({
      error: "content missing",
    });
  } else {
    const newNote = new Note({
      content: note.content,
      date: new Date(),
      important: note.important || false,
    });

    newNote
      .save()
      .then((note) => {
        return res.json(note);
      })
      .catch((err) => next(err));
  }
});

//UPDATE a note
app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    res.status(400).send({ error: "note should be minimum of 5 characters" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
