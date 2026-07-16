import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request.js'
import type { ApiResponse, Category, Side, OrderType, TimeInForce, OrderStatus, AccountType } from '../types/common.js'
import type { BotSymbolSetting } from '../types/nested.js'
import type { RestClientOptions } from '../config.js'

// TODO(v0.2): the grid / futures-grid / futures-combo / futures-martingale / dca / combo bot subsystems
// use snake_case on the wire. Follow-up: accept camelCase params on these methods and translate to
// snake_case on the request body (like the rest of the SDK). Until then, params exactly match the
// Bybit docs for those subsystems.

export class BotService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Close a running futures grid bot by bot ID
   */
  async closeFuturesGridBot(params: {
    bot_id: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/close',
      signed: true,
      body: {
        bot_id: params.bot_id,
      },
    })
  }

  /**
   * Create a new futures grid trading bot with specified parameters
   */
  async createFuturesGridBot(params: {
    symbol: string
    grid_mode: number
    min_price: string
    max_price: string
    cell_number: number
    leverage: string
    grid_type: number
    total_investment: string
    take_profit_per?: string
    stop_loss_per?: string
    entry_price?: string
    source?: number
    followed_grid_id?: number
    toolsDiscoveryParameter?: Record<string, unknown>
    stop_loss_price?: string
    take_profit_price?: string
    tp_sl_type?: number
    block_source?: number
    create_type?: number
    init_bonus?: string
    business_remark?: string
    trailing_stop_per?: string
    move_up_price?: string
    move_down_price?: string
    channel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/create',
      signed: true,
      body: {
        symbol:                    params.symbol,
        grid_mode:                 params.grid_mode,
        min_price:                 params.min_price,
        max_price:                 params.max_price,
        cell_number:               params.cell_number,
        leverage:                  params.leverage,
        grid_type:                 params.grid_type,
        total_investment:          params.total_investment,
        take_profit_per:           params.take_profit_per,
        stop_loss_per:             params.stop_loss_per,
        entry_price:               params.entry_price,
        source:                    params.source,
        followed_grid_id:          params.followed_grid_id,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        stop_loss_price:           params.stop_loss_price,
        take_profit_price:         params.take_profit_price,
        tp_sl_type:                params.tp_sl_type,
        block_source:              params.block_source,
        create_type:               params.create_type,
        init_bonus:                params.init_bonus,
        business_remark:           params.business_remark,
        trailing_stop_per:         params.trailing_stop_per,
        move_up_price:             params.move_up_price,
        move_down_price:           params.move_down_price,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Get full details of a futures grid bot including PnL, positions, and status
   */
  async getFuturesGridDetail(params: {
    bot_id: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/detail',
      signed: true,
      body: {
        bot_id: params.bot_id,
      },
    })
  }

  /**
   * Validate futures grid bot input parameters and return allowable ranges
   */
  async validateFuturesGridInput(params: {
    symbol: string
    cell_number: number
    min_price: string
    max_price: string
    leverage: string
    grid_type: number
    grid_mode: number
    stop_loss_price?: string
    take_profit_price?: string
    tp_sl_type?: number
    entry_price?: string
    stop_loss_per?: string
    take_profit_per?: string
    trailing_stop_per?: string
    init_margin?: string
    move_up_price?: string
    move_down_price?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fgridbot/validate',
      signed: true,
      body: {
        symbol:            params.symbol,
        cell_number:       params.cell_number,
        min_price:         params.min_price,
        max_price:         params.max_price,
        leverage:          params.leverage,
        grid_type:         params.grid_type,
        grid_mode:         params.grid_mode,
        stop_loss_price:   params.stop_loss_price,
        take_profit_price: params.take_profit_price,
        tp_sl_type:        params.tp_sl_type,
        entry_price:       params.entry_price,
        stop_loss_per:     params.stop_loss_per,
        take_profit_per:   params.take_profit_per,
        trailing_stop_per: params.trailing_stop_per,
        init_margin:       params.init_margin,
        move_up_price:     params.move_up_price,
        move_down_price:   params.move_down_price,
      },
    })
  }

  /**
   * Close a running DCA bot with a specified settlement mode.
   */
  async closeDcaBot(params: {
    botId: number
    closeMode: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/dca/close-bot',
      signed: true,
      body: {
        bot_id:     params.botId,
        close_mode: params.closeMode,
      },
    })
  }

  /**
   * Create a new DCA (Dollar-Cost Averaging) bot with custom parameters.
   */
  async createDcaBot(params: {
    parameters: Record<string, unknown>
    toolsDiscoveryParameter?: Record<string, unknown>
    channel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/dca/create-bot',
      signed: true,
      body: {
        parameters:                params.parameters,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Close a running futures combo bot by bot ID.
   */
  async closeComboBot(params: {
    bot_id: number
    stop_type?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/close',
      signed: true,
      body: {
        bot_id:    params.bot_id,
        stop_type: params.stop_type,
      },
    })
  }

  /**
   * Create a new futures combo bot with multi-symbol portfolio and rebalancing.
   */
  async createComboBot(params: {
    leverage: string
    init_margin: string
    adjust_position_mode: number
    symbol_settings: BotSymbolSetting[]
    adjust_position_percent?: string
    adjust_position_time_interval?: number
    sl_percent?: string
    tp_percent?: string
    source?: number
    block_source?: number
    create_type?: number
    followed_bot_id?: number
    init_bonus?: string
    trailing_stop_percent?: string
    channel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/create',
      signed: true,
      body: {
        leverage:                      params.leverage,
        init_margin:                   params.init_margin,
        adjust_position_mode:          params.adjust_position_mode,
        symbol_settings:               params.symbol_settings,
        adjust_position_percent:       params.adjust_position_percent,
        adjust_position_time_interval: params.adjust_position_time_interval,
        sl_percent:                    params.sl_percent,
        tp_percent:                    params.tp_percent,
        source:                        params.source,
        block_source:                  params.block_source,
        create_type:                   params.create_type,
        followed_bot_id:               params.followed_bot_id,
        init_bonus:                    params.init_bonus,
        trailing_stop_percent:         params.trailing_stop_percent,
        channel:                       params.channel,
      },
    })
  }

  /**
   * Get full details of a futures combo bot including PnL, positions, and status.
   */
  async getComboDetail(params: {
    bot_id: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/detail',
      signed: true,
      body: {
        bot_id: params.bot_id,
      },
    })
  }

  /**
   * Validate combo bot input parameters and return allowable ranges.
   */
  async getComboLimit(params: {
    leverage: string
    init_margin: string
    adjust_position_mode: number
    symbol_settings: BotSymbolSetting[]
    adjust_position_percent?: string
    adjust_position_time_interval?: number
    sl_percent?: string
    tp_percent?: string
    need_to_slippage?: boolean
    app_name?: string
    trailing_stop_percent?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fcombobot/getlimit',
      signed: true,
      body: {
        leverage:                      params.leverage,
        init_margin:                   params.init_margin,
        adjust_position_mode:          params.adjust_position_mode,
        symbol_settings:               params.symbol_settings,
        adjust_position_percent:       params.adjust_position_percent,
        adjust_position_time_interval: params.adjust_position_time_interval,
        sl_percent:                    params.sl_percent,
        tp_percent:                    params.tp_percent,
        need_to_slippage:              params.need_to_slippage,
        app_name:                      params.app_name,
        trailing_stop_percent:         params.trailing_stop_percent,
      },
    })
  }

  /**
   * Close a running futures Martingale bot by bot ID.
   */
  async closeFuturesMartingaleBot(params: {
    botId: number
    stopType?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/close',
      signed: true,
      body: {
        bot_id:    params.botId,
        stop_type: params.stopType,
      },
    })
  }

  /**
   * Create a new futures Martingale bot with DCA averaging strategy.
   */
  async createFuturesMartingaleBot(params: {
    symbol: string
    martingaleMode: string
    leverage: string
    priceFloatPercent: string
    addPositionPercent: string
    addPositionNum: number
    initMargin: string
    roundTpPercent: string
    autoCycleToggle?: string
    slPercent?: string
    entryPrice?: string
    source?: string
    followedBotId?: number
    blockSource?: string
    createType?: string
    initBonus?: string
    channel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/create',
      signed: true,
      body: {
        symbol:               params.symbol,
        martingale_mode:      params.martingaleMode,
        leverage:             params.leverage,
        price_float_percent:  params.priceFloatPercent,
        add_position_percent: params.addPositionPercent,
        add_position_num:     params.addPositionNum,
        init_margin:          params.initMargin,
        round_tp_percent:     params.roundTpPercent,
        auto_cycle_toggle:    params.autoCycleToggle,
        sl_percent:           params.slPercent,
        entry_price:          params.entryPrice,
        source:               params.source,
        followed_bot_id:      params.followedBotId,
        block_source:         params.blockSource,
        create_type:          params.createType,
        init_bonus:           params.initBonus,
        channel:              params.channel,
      },
    })
  }

  /**
   * Get full details of a futures Martingale bot including PnL, positions, and round progress.
   */
  async getFuturesMartingaleDetail(params: {
    botId: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/detail',
      signed: true,
      body: {
        bot_id: params.botId,
      },
    })
  }

  /**
   * Validate Martingale bot input parameters and return allowable ranges.
   */
  async getFuturesMartingaleLimit(params: {
    symbol: string
    martingaleMode: string
    leverage: string
    priceFloatPercent?: string
    addPositionPercent?: string
    addPositionNum?: number
    initMargin?: string
    roundTpPercent?: string
    slPercent?: string
    entryPrice?: string
    needToSlippage?: boolean
    appName?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/fmartingalebot/getlimit',
      signed: true,
      body: {
        symbol:               params.symbol,
        martingale_mode:      params.martingaleMode,
        leverage:             params.leverage,
        price_float_percent:  params.priceFloatPercent,
        add_position_percent: params.addPositionPercent,
        add_position_num:     params.addPositionNum,
        init_margin:          params.initMargin,
        round_tp_percent:     params.roundTpPercent,
        sl_percent:           params.slPercent,
        entry_price:          params.entryPrice,
        need_to_slippage:     params.needToSlippage,
        app_name:             params.appName,
      },
    })
  }

  /**
   * Close a running spot grid bot with a specified settlement mode.
   */
  async closeGridBot(params: {
    grid_id: number
    close_mode: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/close-grid',
      signed: true,
      body: {
        grid_id:    params.grid_id,
        close_mode: params.close_mode,
      },
    })
  }

  /**
   * Create a new spot grid trading bot.
   */
  async createGridBot(params: {
    symbol: string
    max_price: string
    min_price: string
    total_investment: string
    cell_number: number
    followed_grid_id?: number
    source?: number
    entry_price?: string
    stop_loss_price?: string
    take_profit_price?: string
    toolsDiscoveryParameter?: Record<string, unknown>
    base_investment?: string
    quote_investment?: string
    invest_mode?: number
    block_source?: number
    create_type?: number
    ts_percent?: string
    enable_trailing?: boolean
    limit_up_price?: string
    channel?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/create-grid',
      signed: true,
      body: {
        symbol:                    params.symbol,
        max_price:                 params.max_price,
        min_price:                 params.min_price,
        total_investment:          params.total_investment,
        cell_number:               params.cell_number,
        followed_grid_id:          params.followed_grid_id,
        source:                    params.source,
        entry_price:               params.entry_price,
        stop_loss_price:           params.stop_loss_price,
        take_profit_price:         params.take_profit_price,
        tools_discovery_parameter: params.toolsDiscoveryParameter,
        base_investment:           params.base_investment,
        quote_investment:          params.quote_investment,
        invest_mode:               params.invest_mode,
        block_source:              params.block_source,
        create_type:               params.create_type,
        ts_percent:                params.ts_percent,
        enable_trailing:           params.enable_trailing,
        limit_up_price:            params.limit_up_price,
        channel:                   params.channel,
      },
    })
  }

  /**
   * Query full details of a specific grid bot by grid_id.
   */
  async getGridDetail(params: {
    grid_id: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/query-grid-detail',
      signed: true,
      body: {
        grid_id: params.grid_id,
      },
    })
  }

  /**
   * Validate spot grid bot parameters before creation.
   */
  async validateGridInput(params: {
    symbol: string
    cell_number: number
    min_price: string
    max_price: string
    total_investment: string
    stop_loss?: string
    take_profit?: string
    entry_price?: string
    base_investment?: string
    quote_investment?: string
    invest_mode?: number
    ts_percent?: string
    enable_trailing?: boolean
    limit_up_price?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/grid/validate-input',
      signed: true,
      body: {
        symbol:           params.symbol,
        cell_number:      params.cell_number,
        min_price:        params.min_price,
        max_price:        params.max_price,
        total_investment: params.total_investment,
        stop_loss:        params.stop_loss,
        take_profit:      params.take_profit,
        entry_price:      params.entry_price,
        base_investment:  params.base_investment,
        quote_investment: params.quote_investment,
        invest_mode:      params.invest_mode,
        ts_percent:       params.ts_percent,
        enable_trailing:  params.enable_trailing,
        limit_up_price:   params.limit_up_price,
      },
    })
  }
}
