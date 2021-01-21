const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const xss = require("xss-clean");
const app = express();
dotenv.config();

const authRoutes = require('./routes/auth');
const userModel = require('./models/User');

// Connect to MongoDB
mongoose
    .connect(
        process.env.MONGOURI,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("MongoDB successfully connected!"))
    .catch(err => console.log(err));

// Body Parser Middleware
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
}));
app.use(xss());

// Routes middleware
app.use('/api', authRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log((`Server is running on port ${port}`)))

