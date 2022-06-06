const connectToMongo = require("./db.js");
const express = require("express");
const cors=require("cors")

//Mongo DB connection status
connectToMongo();

const app = express();
const port = 4000;

//middlleware to read request from body
app.use(express.json());
app.use(cors())

//Available Routes
app.use("/api/auth", require("./routes/Auth-route"));
app.use("/api/notes", require("./routes/Notes-route"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
