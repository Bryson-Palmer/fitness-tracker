// express server with mongoose
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

require("./models");

// define ports
const PORT = process.env.PORT || 3000;

// define app
const app = express();

// install and use the morgan logger
app.use(logger("dev"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static file directory
app.use(express.static("public"));

// connection to mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("Connected To MongoDB."))
    .catch(err => console.log(err));


// routes
app.use(require("./routes/htmlRoutes"));
app.use(require("./routes/apiRoutes"));

// listen to port
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});