import type { AxiosInstance } from 'axios'

export interface RestClientOptions {
  apiKey?: string
  apiSecret?: string
  testnet?: boolean
  baseUrl?: string
  recvWindow?: string
  timeout?: number
  axiosInstance?: AxiosInstance
}

export const BASE_URL_MAINNET = 'https://api.bybit.com'
export const BASE_URL_TESTNET = 'https://api-testnet.bybit.com'
export const DEFAULT_RECV_WINDOW = '5000'
export const DEFAULT_TIMEOUT_MS = 10_000
