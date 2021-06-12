const express = require("express");
const app = express();

app.use(express.static("build"));

const cors = require("cors");
app.use(cors());

// will find index.html in /build then show it

// parses json to js object,
// then attaches it to request body
//before the route handler is called
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
  {
    id: 4,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

//   GET root
// app.get("/", (req, res) => {
//   res.end("<h1>Hello world!</h1>");
// });

//   GET all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

//   GET specific note
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

// DELETE specific note
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// POST new note
app.post("/api/notes/", (req, res) => {
  const note = req.body;

  if (!note.content) {
    return res.status(400).json({
      error: "content missing",
    });
  } else {
    const newNote = {
      id: generateId(),
      content: note.content,
      date: new Date(),
      important: note.important || false,
    };
    notes = notes.concat(newNote);
    return res.json(newNote);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
