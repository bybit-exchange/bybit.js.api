export interface ApiResponse<T = unknown> {
  retCode: number
  retMsg: string
  result: T
  retExtInfo: Record<string, unknown>
  time: number
}
