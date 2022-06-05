const connectToMongo = require("./db.js");
const express = require("express");
// import {connectToMongo} from './db.js'
connectToMongo();

const app = express();
const port = 4000;

app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/Auth-route"));
app.use("/api/notes", require("./routes/Notes-route"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
