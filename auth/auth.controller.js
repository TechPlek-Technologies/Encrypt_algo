const express = require("express");
const { decryptDataFunction, encryptDatafunction } = require("./functions.js");
const { getAuthToken } = require("./auth.service.js");


const authRouter = express.Router();

authRouter.post('/getAuthToken', getAuthToken);



module.exports= authRouter;