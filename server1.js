const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const base64 = require('base64-js');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
const port = 3000;

// Constants
const TOKEN = 'Partner-API';
const pwdIterations = 65536;
const keySize = 256;
const keyAlgorithm = 'AES';
const encryptAlgorithm = 'AES/CBC/PKCS5Padding';
const secretKeyFactoryAlgorithm = 'PBKDF2WithHmacSHA1';

// Static IV and AES Key
const staticIvBytes = crypto.randomBytes(16);
const staticIvHex = staticIvBytes.toString('hex');
const staticKey = crypto.pbkdf2Sync(TOKEN, crypto.randomBytes(20), pwdIterations, keySize / 8, 'sha1');
const staticAesKeyBase64String = base64.fromByteArray(staticKey);

// Load public key
const publicKey = fs.readFileSync('./certificate/certificate_publickey.pem', 'utf8');

// Encrypt endpoint
app.post('/encrypt', (req, res) => {
  try {
    const plainText = JSON.stringify(req.body);

    // Encrypt data
    const cipher = crypto.createCipheriv('aes-256-cbc', staticKey, staticIvBytes);
    let encryptedText = cipher.update(plainText, 'utf8', 'base64');
    encryptedText += cipher.final('base64');

    const ivBase64String = base64.fromByteArray(staticIvBytes);
    const concatenatedIVAndAes = ivBase64String + '|' + staticAesKeyBase64String;

    // Encrypt concatenated token with RSA
    const rsaEncryptedToken = crypto.publicEncrypt(publicKey, Buffer.from(concatenatedIVAndAes)).toString('base64');

    const output = {
      encData: encryptedText,
      encToken: rsaEncryptedToken
    };

    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Decrypt endpoint
app.post('/decrypt', (req, res) => {
  try {
    const { encData } = req.body;
    
    console.log(encData)
    if (!encData) {
      throw new Error("encData is required");
    }

    const decryptAES = (encryptedData, key, iv) => {
      const keyBuffer = Buffer.from(base64.toByteArray(key));
      const ivBuffer = Buffer.from(iv, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      let decryptedText = decipher.update(encryptedData, 'base64', 'utf8');
      decryptedText += decipher.final('utf8');
      return decryptedText;
    };

    const decryptedText = decryptAES(encData, staticAesKeyBase64String, staticIvHex);
    res.json({ decryptedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error});
  }
});

// get token
app.post('/get-token', async (req, res, next) => {
  try {
    const { encRequest:encData,encToken:encToken } = req.body;
    console.log("Requesting API with encrypted data:", encData);
    console.log("Using encrypted token:", encToken);

    try {
      const response = await axios.post(
        "https://sbi-dev7.sbicard.com/api-gateway/resource/oAuth/tokenGenPartner",
        {
          encData: encData,
          encToken: encToken,
        },
        {
          headers: {
            'IDENTIFIER_1': 'Parath_telecom'
          }
        }
      );
      res.send(response);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
