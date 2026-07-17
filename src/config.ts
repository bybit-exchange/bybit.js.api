import type { AxiosInstance } from 'axios'

interface CommonOptions {
  apiKey?:     string
  apiSecret?:  string
  recvWindow?: string
}

// Bring-your-own axios instance: baseUrl / testnet / timeout must be set on the
// axios instance, so this branch of the union forbids them at compile time.
interface AxiosInstanceOptions extends CommonOptions {
  axiosInstance: AxiosInstance
  baseUrl?:      never
  testnet?:      never
  timeout?:      never
}

// Managed-http options: SDK creates the axios instance from these fields.
interface ManagedHttpOptions extends CommonOptions {
  axiosInstance?: undefined
  testnet?:       boolean
  baseUrl?:       string
  timeout?:       number
}

export type RestClientOptions = AxiosInstanceOptions | ManagedHttpOptions

export const BASE_URL_MAINNET     = 'https://api.bybit.com'
export const BASE_URL_TESTNET     = 'https://api-testnet.bybit.com'
export const DEFAULT_RECV_WINDOW  = '5000'
export const DEFAULT_TIMEOUT_MS   = 10_000
