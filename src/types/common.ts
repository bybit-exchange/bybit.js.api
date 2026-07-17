export interface ApiResponse<T = unknown> {
  retCode: number
  retMsg:  string
  result:  T
  retExtInfo: Record<string, unknown>
  time: number
}

// Escape-hatch string alias: TS keeps autocomplete for the known values while still
// accepting any string, so we can widen safely as Bybit adds new enum values.
type StringLiteral<T extends string> = T | (string & {})

export type Category    = StringLiteral<'spot' | 'linear' | 'inverse' | 'option'>
export type Side        = StringLiteral<'Buy' | 'Sell'>
export type OrderType   = StringLiteral<'Market' | 'Limit'>
export type TimeInForce = StringLiteral<'GTC' | 'IOC' | 'FOK' | 'PostOnly'>
export type OrderStatus = StringLiteral<
  | 'New'
  | 'PartiallyFilled'
  | 'Untriggered'
  | 'Rejected'
  | 'PartiallyFilledCanceled'
  | 'Filled'
  | 'Cancelled'
  | 'Triggered'
  | 'Deactivated'
>
export type AccountType = StringLiteral<'UNIFIED' | 'CONTRACT' | 'SPOT' | 'FUND'>

export interface Paginated<T> {
  list:            T[]
  nextPageCursor?: string
  category?:       string
}
