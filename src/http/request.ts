import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { signV5 } from './sign'
import { BybitApiError } from './errors'
import type { ApiResponse } from '../types/common'
import {
  type RestClientOptions,
  BASE_URL_MAINNET,
  BASE_URL_TESTNET,
  DEFAULT_RECV_WINDOW,
  DEFAULT_TIMEOUT_MS,
} from '../config'

export interface RequestSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  signed: boolean
  query?: Record<string, unknown>
  body?: Record<string, unknown>
}

export function createHttp(options: RestClientOptions): AxiosInstance {
  if (options.axiosInstance) return options.axiosInstance
  const baseURL = options.baseUrl || (options.testnet ? BASE_URL_TESTNET : BASE_URL_MAINNET)
  return axios.create({
    baseURL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
  })
}

function serializeQuery(params: Record<string, unknown> | undefined): string {
  if (!params) return ''
  const entries: [string, string][] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    entries.push([k, typeof v === 'object' ? JSON.stringify(v) : String(v)])
  }
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return new URLSearchParams(entries).toString()
}

function stripUndefined<T extends Record<string, unknown>>(o: T): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(o)) {
    if (v !== undefined) out[k] = v
  }
  return out as T
}

export async function requestJson<T = unknown>(
  http: AxiosInstance,
  options: RestClientOptions,
  spec: RequestSpec,
): Promise<ApiResponse<T>> {
  const timestamp = Date.now().toString()
  const recvWindow = options.recvWindow ?? DEFAULT_RECV_WINDOW
  const cleanQuery = spec.query ? stripUndefined(spec.query) : undefined
  const cleanBody = spec.body ? stripUndefined(spec.body) : undefined
  const queryString = serializeQuery(cleanQuery)
  const bodyString = cleanBody ? JSON.stringify(cleanBody) : ''

  const config: AxiosRequestConfig = {
    method: spec.method,
    url: spec.path + (queryString ? '?' + queryString : ''),
    headers: {} as Record<string, string>,
  }
  if (cleanBody) config.data = cleanBody

  if (spec.signed) {
    if (!options.apiKey || !options.apiSecret) {
      throw new Error('Signed endpoint requires apiKey + apiSecret in RestClientOptions')
    }
    const payload = spec.method === 'GET' ? queryString : bodyString
    const signature = signV5(options.apiSecret, timestamp, options.apiKey, recvWindow, payload)
    Object.assign(config.headers as Record<string, string>, {
      'X-BAPI-API-KEY': options.apiKey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': recvWindow,
      'X-BAPI-SIGN': signature,
    })
  }

  const response = await http.request<ApiResponse<T>>(config)
  const body = response.data
  if (body && typeof body === 'object' && 'retCode' in body && body.retCode !== 0) {
    throw new BybitApiError(body as ApiResponse<unknown>)
  }
  return body
}
