import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class RateLimitService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}
}
