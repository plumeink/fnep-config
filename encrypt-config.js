# encrypt-config.js — AES-256-GCM encryption tool for config.json
# Usage: node encrypt-config.js <api-url> <hex-key>
# Output: writes config.json with {v, p, n} format

const crypto = require('crypto');
const fs = require('fs');

const [,, apiUrl, hexKey] = process.argv;

if (!apiUrl || !hexKey) {
    console.error('Usage: node encrypt-config.js <api-url> <hex-key>');
    process.exit(1);
}

if (hexKey.length !== 64) {
    console.error(`Key must be 64 hex chars (32 bytes), got ${hexKey.length}`);
    process.exit(1);
}

const key = Buffer.from(hexKey, 'hex');
const nonce = crypto.randomBytes(12);

const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
const plaintext = Buffer.from(apiUrl, 'utf8');
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const authTag = cipher.getAuthTag();
const encryptedPayload = Buffer.concat([ciphertext, authTag]);

const config = {
    v: 1,
    p: encryptedPayload.toString('base64'),
    n: nonce.toString('base64')
};

const jsonStr = JSON.stringify(config, null, 2);
console.log(jsonStr);
fs.writeFileSync('config.json', jsonStr + '\n', 'utf8');
console.error('\nWritten to config.json');
