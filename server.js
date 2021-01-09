const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

// Body Parser Middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGOURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected!"))
    .catch(err => console.log(err));

const port = process.env.PORT || 8080;

app.listen(port, () => console.log((`Server is running on port ${port}`)))

