import crypto from 'crypto'
import { signV5 } from '../src/http/sign'

describe('signV5', () => {
  it('produces HMAC_SHA256(secret, timestamp+apiKey+recvWindow+payload) in hex', () => {
    const apiSecret  = 'secret-value'
    const apiKey     = 'api-key'
    const timestamp  = '1700000000000'
    const recvWindow = '5000'
    const payload    = 'category=linear&symbol=BTCUSDT'

    const expected = crypto
      .createHmac('sha256', apiSecret)
      .update(timestamp + apiKey + recvWindow + payload)
      .digest('hex')

    expect(signV5(apiSecret, timestamp, apiKey, recvWindow, payload)).toBe(expected)
  })

  it('is deterministic — same inputs produce same signature', () => {
    const a = signV5('s', 't', 'k', 'w', 'p')
    const b = signV5('s', 't', 'k', 'w', 'p')
    expect(a).toBe(b)
  })

  it('differs when any input differs', () => {
    const base = signV5('secret', '1', 'k', '5000', 'q=1')
    expect(signV5('other',  '1', 'k', '5000', 'q=1')).not.toBe(base)
    expect(signV5('secret', '2', 'k', '5000', 'q=1')).not.toBe(base)
    expect(signV5('secret', '1', 'x', '5000', 'q=1')).not.toBe(base)
    expect(signV5('secret', '1', 'k', '9999', 'q=1')).not.toBe(base)
    expect(signV5('secret', '1', 'k', '5000', 'q=2')).not.toBe(base)
  })
})
