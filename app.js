require("dotenv").config();
const express = require("express");
const router = require("./routers/");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;
