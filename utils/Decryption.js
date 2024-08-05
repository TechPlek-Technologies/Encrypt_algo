const crypto = require('crypto');
const forge = require('node-forge');
const publicKey = require('../pem');

// Load the private key from the PEM file

function DecryptionLogic(apiResponsePayload) {
  const { encRequest, encToken } = apiResponsePayload;

  // Step 1: Decrypt the token using "RSA" algorithm and the private key
  const privateKey = forge.pki.privateKeyFromPem(publicKey);
  const decryptedToken = privateKey.decrypt(forge.util.decode64(encToken), 'RSA-OAEP');

  // Step 2: Split the decrypted token to get IV and Base64 encoded key
  const [base64IV, base64Key] = decryptedToken.split('|');

  // Step 3: Convert the Base64 encoded IV back to byte array
  const iv = Buffer.from(base64IV, 'base64');

  // Step 4: Convert the Base64 encoded key back to byte array
  const key = Buffer.from(base64Key, 'base64');

  // Step 5: Decrypt the encrypted data using the IV and key with decryption Algorithm "AES/CBC/PKCS5Padding"
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(encRequest, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

module.exports = DecryptionLogic;
