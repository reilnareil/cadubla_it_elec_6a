const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const postsRoutes = require('./routes/posts');

mongoose.connect("mongodb+srv://reilancadubla:Un4tvsKjRhnZiez5@cluster0.iwilt.mongodb.net/angulardb?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(() => {
        console.log('Connection Failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;