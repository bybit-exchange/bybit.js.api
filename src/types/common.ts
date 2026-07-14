export interface ApiResponse<T = unknown> {
  retCode: number
  retMsg:  string
  result:  T
  retExtInfo: Record<string, unknown>
  time: number
}

// Shared V5 primitives — safe to widen to plain string at the call site.
export type Category    = 'spot' | 'linear' | 'inverse' | 'option'
export type Side        = 'Buy' | 'Sell'
export type OrderType   = 'Market' | 'Limit'
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'PostOnly'
export type OrderStatus =
  | 'New'
  | 'PartiallyFilled'
  | 'Untriggered'
  | 'Rejected'
  | 'PartiallyFilledCanceled'
  | 'Filled'
  | 'Cancelled'
  | 'Triggered'
  | 'Deactivated'
export type AccountType = 'UNIFIED' | 'CONTRACT' | 'SPOT' | 'FUND'

export interface Paginated<T> {
  list:        T[]
  nextPageCursor?: string
  category?:   string
}
