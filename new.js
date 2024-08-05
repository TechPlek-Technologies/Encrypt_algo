const { encryptData } = require("./main");

// Example usage for encryption
encryptData("{\"user\":\"LG_Parath_telecom\",\"pass\":\"A3Es82519\"}")
    .then((encrypted) => {
        console.log('Encrypted Data:', encrypted);
    })
    .catch(console.error);

// Example usage for decryption
decryptDat({
    token: "WMSTl+QhTUER+dLpbJ8adW1UZ99+O8M6TmFhfiBpIVPwbVb9GOhWl25raI+FDpdkOZ6aH+iGF3GqFlL1nuvQL78XRzb+gpd9VcHuI0xkQYDGVL4ekoiSjLlxI1PtR5Jd7lkM+wJQPTB7OZ9gdHU5aVFXP/aN1mbs7un/5dgbJ5ynR7vsLeqYIWYl1vlvlwrx+l3HTbHL+ycmm2LYdb7CBYdMF2xFHvOOg/fJKm2D68VRl95AAbc7ttCBmUp5ANQjuFKtb+caETagJZ/AK3g6BFuZjolSrScRsZ1TWyqpO7yOrSCTqLDm/4NrPIvTGkKtnVwFqTQy0BUQ2cIxpvPtXA==",
    encData: "FckmmHjS76XOwl2nNlxauePnFjxWv7UXkoEbjUFQJ4x74LHHq8Gw1he1U+jcxaaX"
})
    .then((decrypted) => {
        console.log('Decrypted Data:', decrypted);
    })
    .catch(console.error);
