const crypto = require("crypto");


// Step 1: Create Key
const salt = crypto.randomBytes(20);
const key = crypto.pbkdf2Sync("API", salt, 65536, 32, "sha1"); // 32 bytes = 256 bits

// Step 2: Base64 encode the key
const encodedKey = key.toString("base64");

// Step 3: Create a random initialization vector (IV) of size 16 bytes
const iv = crypto.randomBytes(16);

// Step 4: Convert the IV into Hexadecimal String
const ivHex = iv.toString("hex");

// Step 5: Encrypt data using AES/CBC/PKCS5Padding
function encryptData(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf-8", "base64");
  encrypted += cipher.final("base64");
  console.log("encrypted",encrypted);
  return encrypted;
}

// Step 6: Base 64 encode the encrypted text
// This is done in the encryptData function, which returns a base64 encoded string

// Step 7: Generate concatenated token (Base64 encoded IV + "|" + Base64 encoded generated key)
const token = `${iv.toString('base64')}|${encodedKey}`;

const publicKey = `-----BEGIN CERTIFICATE-----
MIIGizCCBXOgAwIBAgIEAQpVtTANBgkqhkiG9w0BAQsFADCBkzELMAkGA1UEBhMC
SU4xKjAoBgNVBAoTIWVNdWRocmEgQ29uc3VtZXIgU2VydmljZXMgTGltaXRlZDEd
MBsGA1UECxMUQ2VydGlmeWluZyBBdXRob3JpdHkxOTA3BgNVBAMTMGUtTXVkaHJh
IFN1YiBDQSBDbGFzcyAyIGZvciBEb2N1bWVudCBTaWduZXIgMjAxNDAeFw0xOTA5
MDIwNzUzMTVaFw0yMjA5MDEwNzUzMTVaMIIBMzELMAkGA1UEBhMCSU4xNzA1BgNV
BAoTLlNCSSBDQVJEUyBBTkQgUEFZTUVOVCBTRVJWSUNFUyBQUklWQVRFIExJTUlU
RUQxEzARBgNVBAsTCk9QRVJBVElPTlMxDzANBgNVBBETBjEyMjAwMjEQMA4GA1UE
CBMHSEFSWUFOQTEQMA4GA1UECRMHR1VSR0FPTjFjMGEGA1UEMxNaMTB0aCAxMXRo
IGFuZCAxMnRoIEJVSUxESU5HIDMgRExGIElORklOSVRZIFRPV0VSIEMgQkxPQ0sg
MiBETEYgQ1lCRVIgQ0lUWSBHVVJVR1JBTSBIQVJZQU5BMTwwOgYDVQQDEzNEUyBT
QkkgQ0FSRFMgQU5EIFBBWU1FTlQgU0VSVklDRVMgUFJJVkFURSBMSU1JVEVEIDMw
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDPCe4wHvFsClb5Jxu6Krg+
pdwgRZJFivAbf1JcnmzamWq99Q9pau31b0OJNkDbW2/NiovChzHaTnu2GVReh5AQ
4q2+nmCK+Ma9sM6pksvso0di8ywztgCQb3diS8WO58CDr726Fwlw/efDYRY/ilj2
rvtP+D+eLnH/oWk2evk4zf8ZNtRMyZuRP/4DSHeUL/SQzajnBwzT5cyNJIOT2gxk
OGEJWTsYL44CTBipcUED0mr+WPb/OjtgzZp/jNGCNuRvCe3eMyxmVjCUnSY5Tljf
ARNnQaW0ah0ARFXLPv0W3cO4oaqojGqIocWcQgcMexUolexKEHYRhyoNDphVh1SR
AgMBAAGjggJCMIICPjATBgNVHSMEDDAKgAhNpkTIpuIACDAdBgNVHQ4EFgQUyVws
PMCiJU6ltpUPxs1iPxARdhgwDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBsAw
IQYDVR0RBBowGIEWYW1pdC5iYXRyYUBzYmljYXJkLmNvbTA0BgNVHSUELTArBggr
BgEFBQcDBAYKKwYBBAGCNwoDDAYJKoZIhvcvAQEFBggrBgEFBQcDAjCB0gYDVR0g
BIHKMIHHMC0GBmCCZGQCAjAjMCEGCCsGAQUFBwICMBUaE0NsYXNzIDIgQ2VydGlm
aWNhdGUwRAYGYIJkZAoBMDowOAYIKwYBBQUHAgIwLBoqT3JnYW5pc2F0aW9uYWwg
RG9jdW1lbnQgU2lnbmVyIENlcnRpZmljYXRlMFAGB2CCZGQBCAIwRTBDBggrBgEF
BQcCARY3aHR0cDovL3d3dy5lLW11ZGhyYS5jb20vcmVwb3NpdG9yeS9jcHMvZS1N
dWRocmFfQ1BTLnBkZjB3BggrBgEFBQcBAQRrMGkwJAYIKwYBBQUHMAGGGGh0dHA6
Ly9vY3NwLmUtbXVkaHJhLmNvbTBBBggrBgEFBQcwAoY1aHR0cDovL3d3dy5lLW11
ZGhyYS5jb20vcmVwb3NpdG9yeS9jYWNlcnRzL2RvY2NsMi5jcnQwQwYDVR0fBDww
OjA4oDagNIYyaHR0cDovL3d3dy5lLW11ZGhyYS5jb20vcmVwb3NpdG9yeS9jcmxz
L2RvY2NsMi5jcmwwDQYJKoZIhvcNAQELBQADggEBADmJriLvcQ02sPwsGK1W/xSL
L5D0JFHjVU4q63C8V/dr12FQfeNksNHxpk8U9lB1YZ09SkoILeRsV14qGGMg5Ynz
ps5w/heHJWSiOlzOk0Fp+B7lAmLEliYAabA9QaOK9Pxk55Wk5OmWN7eM83IleU5J
ZabAvSjchAiNfOlXwu8UGyGkrmUv+o/82ahjTvxwXmOPG8bpNKFOEsBYRFttg5LZ
o0K6z116pqJACAee1GS9YTY1JbNLCUlWQwPRrx1qfS7F95ZSekQ/iUhA1ZYUc3/d
nvZxH/cl7dZwsYxaCnLeYmb7izjiTK5/B8fgb/l7dpX7DQYe26+ZpkFBEI8YSvU=
-----END CERTIFICATE-----`;
// Step 8: Encrypt the token using RSA algorithm and sprint.pem public key
const encryptedToken = crypto.publicEncrypt(publicKey, Buffer.from(token)).toString("base64");

// Encryption function
const encryptDataFunction = (data) => {
  try {
    const stringData = JSON.stringify(data);
    console.log("stringData",stringData);
    const encryptedData = encryptData(stringData, key, iv);

    return {
      encRequest: encryptedData,
      encToken: encryptedToken
    };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};


// Decryption function
const decryptDataFunction = (req, res, next) => {
  try {
    const { encryptedData } = req.body;

    // Convert IV from Hexadecimal String to Buffer
    const ivBuffer = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
    let decrypted = decipher.update(encryptedData, "base64", "utf-8");
    decrypted += decipher.final("utf-8");
    
    res.status(200).json({ decrypted });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { encryptDataFunction, decryptDataFunction };
