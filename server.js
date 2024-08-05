




// dyamic  ivHex, aesKeyBase64String values




const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const base64 = require('base64-js');

const app = express();
app.use(bodyParser.json());
const port = 4000;

// Constants
const TOKEN = 'Partner-API';
const pwdIterations = 65536;
const keySize = 256;
const keyAlgorithm = 'AES';
const encryptAlgorithm = 'AES/CBC/PKCS5Padding';
const secretKeyFactoryAlgorithm = 'PBKDF2WithHmacSHA1';

// Load public key
const publicKey = fs.readFileSync('./certificate/certificate_publickey.pem', 'utf8');

// Encrypt endpoint
app.post('/encrypt', (req, res) => {
  try {
    const plainText = JSON.stringify(req.body);

    // Generate salt
    const saltBytes = crypto.randomBytes(20);

    // Generate key
    const key = crypto.pbkdf2Sync(TOKEN, saltBytes, pwdIterations, keySize / 8, 'sha1');

    // Create AES key and IV
    const aesKeyBase64String = base64.fromByteArray(key);
    const ivBytes = crypto.randomBytes(16);
    const ivBase64String = base64.fromByteArray(ivBytes);
    const ivHex = ivBytes.toString('hex');

    // Encrypt data
    const cipher = crypto.createCipheriv('aes-256-cbc', key, ivBytes);
    let encryptedText = cipher.update(plainText, 'utf8', 'base64');
    encryptedText += cipher.final('base64');

    const concatenatedIVAndAes = ivBase64String + '|' + aesKeyBase64String;

    // Encrypt concatenated token with RSA
    const rsaEncryptedToken = crypto.publicEncrypt(publicKey, Buffer.from(concatenatedIVAndAes)).toString('base64');

    const output = {
      encRequest: encryptedText,
      encToken: rsaEncryptedToken
    };

    res.json(output);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decrypt endpoint
app.post('/decrypt', (req, res) => {
  try {
    const { encRequest, ivHex, aesKeyBase64String } = req.body;

    const decryptAES = (encryptedData, key, iv) => {
      const keyBuffer = Buffer.from(base64.toByteArray(key));
      const ivBuffer = Buffer.from(iv, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      let decryptedText = decipher.update(encryptedData, 'base64', 'utf8');
      decryptedText += decipher.final('utf8');
      return decryptedText;
    };

    const decryptedText = decryptAES(encRequest, aesKeyBase64String, ivHex);
    res.json({ decryptedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
