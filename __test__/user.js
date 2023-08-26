const request = require("supertest");
const app = require("../app");
// panggil model user
const { User } = require("../models/user");
// panggil generate token jwt
const { generateToken } = require("../helpers/jwt");
