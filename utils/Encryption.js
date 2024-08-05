const crypto = require('crypto');
const forge = require('node-forge');
const publicKeyPem = require('../pem');

// Global variables for key and IV
let key, iv, hexIV;

function generateKeyAndIV() {
  // Step 1: Create Key using the given parameters
  const keyFactoryAlgorithm = 'PBKDF2WithHmacSHA1';
  const iterations = 65536;
  const keySize = 256;
  const salt = crypto.randomBytes(20);
  const password = 'API'; // TOKEN
  key = crypto.pbkdf2Sync(password, salt, iterations, keySize / 8, 'sha1');

  // Step 2: Base64 encode the generated key
  const base64Key = key.toString('base64');

  // Step 3: Create a random initialization vector (IV) of size 16 bytes
  iv = crypto.randomBytes(16);

  // Step 4: Convert the IV into Hexadecimal String
  hexIV = iv.toString('hex');

  return { base64Key, hexIV };
}

function EncryptionLogic(reqData) {
  // Convert reqData to string if it is an object
  const data = typeof reqData === 'string' ? reqData : JSON.stringify(reqData);

  // Generate Key and IV
  const { base64Key, hexIV } = generateKeyAndIV();

  // Step 5: Encrypt the data using the IV and Key with encryption Algorithm "AES/CBC/PKCS5Padding"
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');

  // Step 6: Base 64 encode the encrypted text (already done in step 5)

  // Step 7: Generate a concatenated token (Base64 encoded IV + "|" + Base64 encoded generated key)
  const base64IV = iv.toString('base64');
  const concatenatedToken = `${base64IV}|${base64Key}`;

  // Step 8: Encrypt the token generated in step 7 using "RSA" algorithm and sprint.pem public key
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedToken = forge.util.encode64(publicKey.encrypt(concatenatedToken, 'RSA-OAEP'));

  // Step 9: Encoded Data from Step 6 & encoded token from step 8 will have to be sent as part of API call.
  const apiRequestPayload = {
    encRequest: encryptedData,
    encToken: encryptedToken,
  };

  return apiRequestPayload;
}

function DecryptionLogic(encRequest) {
  // Ensure encRequest is a string
  if (typeof encRequest !== 'string') {
    throw new TypeError('The "encRequest" argument must be of type string.');
  }

  // Step 1: Decrypt the data using the IV and Key with decryption Algorithm "AES/CBC/PKCS5Padding"
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(encRequest, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

module.exports = { EncryptionLogic, DecryptionLogic };
