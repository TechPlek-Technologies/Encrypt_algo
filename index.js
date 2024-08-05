const express = require("express");
const axios = require("axios");
const bodyParser = require('body-parser');
const authRouter = require("./auth/auth.controller");
const { EncryptionLogic, DecryptionLogic } = require("./utils/Encryption");

const app = express();
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.post("/encrypt",(req,res)=>{
  const data=req.body;
  const response = EncryptionLogic(data)
  console.log(response);
  res.send(response)
})
app.post("/decrypt",(req,res)=>{
  const data=req.body;
  const response = DecryptionLogic(data)
  console.log(response);
  res.send(response)
})

app.use("/auth-test",authRouter);


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
