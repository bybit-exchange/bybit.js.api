import type { ApiResponse } from '../types/common'

export class BybitApiError extends Error {
  public readonly retCode: number
  public readonly retMsg: string
  public readonly result: unknown
  public readonly time: number

  constructor(response: ApiResponse<unknown>) {
    super(`[${response.retCode}] ${response.retMsg}`)
    this.name = 'BybitApiError'
    this.retCode = response.retCode
    this.retMsg = response.retMsg
    this.result = response.result
    this.time = response.time
  }
}
