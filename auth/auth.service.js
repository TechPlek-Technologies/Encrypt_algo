const { default: axios } = require("axios");
const { encryptDataFunction } = require("./functions");

const getAuthToken = async (req, res, next) => {
  try {
    const { data } = req.body;
    console.log(data);
    const { encryptedData, encryptedToken } = encryptDataFunction(data);

    console.log("Requesting API with encrypted data:", encryptedData);
    console.log("Using encrypted token:", encryptedToken);

    try {
      const response = await axios.post(
        "https://sbi-uat2.sbicard.com/api-gateway/resource/oAuth/tokenGenPartner",
        {
          encData: encryptedData,
          encToken: encryptedToken,
        },
        {
          headers: {
            'IDENTIFIER_1': 'Parath_telecom'
          }
        }
      );
      console.log(response);
      res.send(response);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { getAuthToken };
