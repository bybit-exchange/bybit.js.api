import crypto from 'crypto'

// Bybit V5 REST signing:
//   payload = timestamp + apiKey + recvWindow + queryStringOrBody
//   signature = HMAC_SHA256(apiSecret, payload).hex
export function signV5(
  apiSecret: string,
  timestamp: string,
  apiKey: string,
  recvWindow: string,
  payload: string,
): string {
  return crypto
    .createHmac('sha256', apiSecret)
    .update(timestamp + apiKey + recvWindow + payload)
    .digest('hex')
}
