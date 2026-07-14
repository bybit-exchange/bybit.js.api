import type { AxiosInstance } from 'axios'
import { requestJson } from '../http/request'
import type { ApiResponse } from '../types/common'
import type { RestClientOptions } from '../config'

export class UserService {
  constructor(
    protected readonly http: AxiosInstance,
    protected readonly opts: RestClientOptions,
  ) {}

  /**
   * Create Sub API Key for a sub-account.
   * @see https://bybit-exchange.github.io/docs/v5/user/create-subuid-apikey
   */
  async createSubApiKey(params: {
    subuid:      number
    readOnly:    number
    permissions: Record<string, unknown>
    ips?:        string
    note?:       string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/create-sub-api',
      signed: true,
      body: {
        subuid:      params.subuid,
        readOnly:    params.readOnly,
        permissions: params.permissions,
        ips:         params.ips,
        note:        params.note,
      },
    })
  }

  /**
   * Create a Sub UID under the master account.
   * @see https://bybit-exchange.github.io/docs/v5/user/create-subuid
   */
  async createSubMember(params: {
    username:   string
    memberType: number
    password?:  string
    switch?:    number
    isUta?:     boolean
    note?:      string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/create-sub-member',
      signed: true,
      body: {
        username:   params.username,
        memberType: params.memberType,
        password:   params.password,
        switch:     params.switch,
        isUta:      params.isUta,
        note:       params.note,
      },
    })
  }

  /**
   * Delete Master API Key.
   * @see https://bybit-exchange.github.io/docs/v5/user/rm-master-apikey
   */
  async deleteApiKey(params: {
    apikey?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/delete-api',
      signed: true,
      body: {
        apikey: params.apikey,
      },
    })
  }

  /**
   * Delete a Sub-account API Key.
   * @see https://bybit-exchange.github.io/docs/v5/user/rm-sub-apikey
   */
  async deleteSubApiKey(params: {
    subuid:  number
    apikey?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/delete-sub-api',
      signed: true,
      body: {
        subuid: params.subuid,
        apikey: params.apikey,
      },
    })
  }

  /**
   * Delete a Sub-account.
   */
  async deleteSubMember(params: {
    subuid: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/del-submember',
      signed: true,
      body: {
        subuid: params.subuid,
      },
    })
  }

  /**
   * Freeze or Unfreeze a Sub UID.
   * @see https://bybit-exchange.github.io/docs/v5/user/froze-subuid
   */
  async frozenSubMember(params: {
    subuid: number
    frozen: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/frozen-sub-member',
      signed: true,
      body: {
        subuid: params.subuid,
        frozen: params.frozen,
      },
    })
  }

  /**
   * Get Affiliate User Info.
   */
  async getAffiliateCustomOpenInfo(params: {
    uid:        string
    coin?:      string
    business?:  string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/aff-customer-info',
      signed: true,
      query: {
        uid:      params.uid,
        coin:     params.coin,
        business: params.business,
      },
    })
  }

  /**
   * Get Member Account Type for the specified UIDs.
   */
  async getMemberAccountType(params: {
    memberIds?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/get-member-type',
      signed: true,
      query: {
        memberIds: params.memberIds,
      },
    })
  }

  /**
   * List all API keys of a Sub-account.
   * @see https://bybit-exchange.github.io/docs/v5/user/list-sub-apikeys
   */
  async listSubApiKeys(params: {
    subuid:  number
    limit?:  number
    cursor?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/sub-apikeys',
      signed: true,
      query: {
        subuid: params.subuid,
        limit:  params.limit,
        cursor: params.cursor,
      },
    })
  }

  /**
   * Get API Key Information for the current key.
   * @see https://bybit-exchange.github.io/docs/v5/user/apikey-info
   */
  async queryApiKey(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/query-api',
      signed: true,
    })
  }

  /**
   * Query Escrow Sub-accounts under Fund Management.
   */
  async queryEscrowSubMembers(params: {
    nextCursor?: number
    pageSize?:   number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/escrow_sub_members',
      signed: true,
      query: {
        nextCursor: params.nextCursor,
        pageSize:   params.pageSize,
      },
    })
  }

  /**
   * Query Referrals invited by the current account.
   */
  async queryReferrals(params: {
    cursor?: string
    size?:   number
    status?: string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/invitation/referrals',
      signed: true,
      query: {
        cursor: params.cursor,
        size:   params.size,
        status: params.status,
      },
    })
  }

  /**
   * Query Sub UID List for the master account.
   * @see https://bybit-exchange.github.io/docs/v5/user/subuid-list
   */
  async querySubMembers(): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/query-sub-members',
      signed: true,
    })
  }

  /**
   * Query the Sub-accounts List with pagination.
   */
  async querySubMembersPaginated(params: {
    pageSize?:   number
    nextCursor?: number
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'GET',
      path:   '/v5/user/submembers',
      signed: true,
      query: {
        pageSize:   params.pageSize,
        nextCursor: params.nextCursor,
      },
    })
  }

  /**
   * Sign or reject an agreement of the specified category.
   */
  async signAgreement(params: {
    category: number
    agree:    boolean
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/agreement',
      signed: true,
      body: {
        category: params.category,
        agree:    params.agree,
      },
    })
  }

  /**
   * Modify Master API Key
   * @see https://bybit-exchange.github.io/docs/v5/user/modify-master-apikey
   */
  async updateApiKey(params: {
    readOnly?:    number
    ips?:         string
    permissions?: Record<string, unknown>
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/update-api',
      signed: true,
      body: {
        readOnly:    params.readOnly,
        ips:         params.ips,
        permissions: params.permissions,
      },
    })
  }

  /**
   * Modify Sub-account API Key
   * @see https://bybit-exchange.github.io/docs/v5/user/modify-sub-apikey
   */
  async updateSubApiKey(params: {
    subuid:       number
    readOnly:     number
    apikey?:      string
    ips?:         string
    permissions?: Record<string, unknown>
    note?:        string
  }): Promise<ApiResponse<unknown>> {
    return requestJson(this.http, this.opts, {
      method: 'POST',
      path:   '/v5/user/update-sub-api',
      signed: true,
      body: {
        subuid:      params.subuid,
        readOnly:    params.readOnly,
        apikey:      params.apikey,
        ips:         params.ips,
        permissions: params.permissions,
        note:        params.note,
      },
    })
  }
}
