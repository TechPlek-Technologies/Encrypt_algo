const crypto = require("crypto");
const fs = require("fs");

// Constants
const CERT_TYPE = "X.509";
const TOKEN = "Partner-API";
const pwdIterations = 65536;
const keySize = 32; // 256 bits
const keyAlgorithm = "aes-256-cbc";
const secretKeyFactoryAlgorithm = "pbkdf2";
const ivLength = 16;

// Generate salt
const saltBytes = crypto.randomBytes(20);

// Generate secret key
const key = crypto.pbkdf2Sync(TOKEN, saltBytes, pwdIterations, keySize, "sha1");

const fixedKey=key;
// Generate IV
const iv = crypto.randomBytes(ivLength);
// Main function

const fixedIv=iv;

async function main() {
  try {
    const plainText = '{"user":"LG_Parath_telecom","pass":"A3Es82519"}';

    // Encrypt the plaintext
    const cipher = crypto.createCipheriv(keyAlgorithm, fixedKey, fixedIv);
    let encryptedText = cipher.update(plainText, "utf8", "base64");
    encryptedText += cipher.final("base64");

    // Encode IV and key
    const ivBase64String = iv.toString("base64");
    const aesKeyBase64String = key.toString("base64");

    const concatenatedIVAndAes = `${ivBase64String}|${aesKeyBase64String}`;

    // Encrypt the concatenated string with RSA
    const publicKey = await getPublicKey("./certificate/LG_Cert.pem");
    const encodedToken = encryptWithRSA(concatenatedIVAndAes, publicKey);

    const output = `{
            'token': '${encodedToken}',
            'encData': '${encryptedText}'
        }`;
    console.log("encrpted data:", output);
 

    // Decrypt the encrypted data
    return {
      encryptedText: encryptedText,
      key: key,
      iv: iv,
    };
  } catch (error) {
    console.error(error.message);
  }
}

async function decrypt() {
  const data =
    "cTj2Kge6pHzWMMrku6zXJAo8iC8SwTsDJ6U2lv1pNFGodoOJuCZsNUvRNOpYAyIJ";
  const decrypted = await decryptAES(data, fixedKey, fixedIv);
  console.log("decrypted:", decrypted);
}

// Get public key from PEM file
async function getPublicKey(inputFile) {
  const data = fs.readFileSync(inputFile, "utf8");
  const publicKey = crypto.createPublicKey(data);
  return publicKey;
}

// Encrypt with RSA
function encryptWithRSA(data, publicKey) {
  const buffer = Buffer.from(data, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}

async function run() {
  const { encryptedText, key, iv } = await main();

  const decrypted = decryptAES(encryptedText, key, iv);
  console.log("decrypted:", decrypted);
}

// Decrypt AES encrypted data
function decryptAES(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv(keyAlgorithm, key, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Call the main function
decrypt().catch(console.error);
