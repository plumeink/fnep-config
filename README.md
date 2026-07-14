# fnep-config

FNEP encrypted API configuration repository. Served via jsDelivr CDN.

## CDN Endpoint

```
https://cdn.jsdelivr.net/gh/plumeink/fnep-config@main/config.json
```

## config.json Format

```json
{
  "v": 1,
  "p": "<base64 AES-256-GCM ciphertext + auth tag>",
  "n": "<base64 12-byte nonce/IV>"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `v`   | number | Format version (increment on scheme change) |
| `p`   | string (base64) | AES-256-GCM ciphertext (API URL) + 16-byte auth tag |
| `n`   | string (base64) | 12-byte GCM nonce/IV |

## Encryption

- **Algorithm**: AES-256-GCM
- **Key**: 32 bytes (64 hex), assembled from 8 fragments distributed across FE modules
- **Nonce**: 12 bytes, randomly generated per encryption
- **Auth tag**: 16 bytes, appended to ciphertext (Web Crypto API compatible)

## Updating the API Address

```bash
node encrypt-config.js "https://new-api.example.com/api" <hex-key>
# Copy output to config.json
git add config.json && git commit -m "update API address" && git push
# Purge jsDelivr cache:
curl https://purge.jsdelivr.net/gh/plumeink/fnep-config@main/config.json
```

## Notes

- This repo is **public** (required for jsDelivr CDN)
- The config.json contains **no plaintext** API address
- The decryption key is **not** stored here — it lives only in the FE bundle as fragments
