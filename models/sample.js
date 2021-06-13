const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("provide password: node sample.js <password>");
  process.exit(1);
}

const password = process.argv[2];

// connecting to database
const url = `mongodb://sarah:${password}@clusters-shard-00-00.zetrn.mongodb.net:27017,clusters-shard-00-01.zetrn.mongodb.net:27017,clusters-shard-00-02.zetrn.mongodb.net:27017/notes-app?ssl=true&replicaSet=atlas-4i5z05-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// creating schema for note
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

//SAVING A NOTE
// const note = new Note({
//     content: "gfdgdfgdfgretertretertrete",
//     date: new Date(),
//     important: false,
//   });

// note.save().then((result) => {
//   console.log(result);
//   mongoose.connection.close();
// });

//FETCHING NOTES
// Note.find({}).then((res) => {
//   res.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });

//FETCHING SPECIFIC NOTES
Note.find({ important: true }).then((res) => {
  console.log(res);
  mongoose.connection.close();
});
