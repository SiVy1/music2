const CryptoJS = require("crypto-js");
const key = process.env.SECRET?.toString();
console.log(key);
// Encrypt
var ciphertext = CryptoJS.AES.encrypt("my message", `${key}`).toString();
console.log(ciphertext);
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, `${key}`);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'
