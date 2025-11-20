/**
 * Provider handler with retry, timeout, and error handling
 */

import axios, { AxiosRequestConfig } from 'axios'
import { retryWithBackoff } from './retry'

const AXIOS_TIMEOUT = 120000 // 2 minutes

export interface ProviderRequest {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  data?: any
  params?: any
}

export async function executeProviderRequest(
  request: ProviderRequest
): Promise<any> {
  const config: AxiosRequestConfig = {
    url: request.url,
    method: request.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...request.headers
    },
    data: request.data,
    params: request.params,
    timeout: AXIOS_TIMEOUT,
    validateStatus: (status) => status < 500 // Don't throw on 4xx
  }

  return retryWithBackoff(async () => {
    const response = await axios(config)
    
    if (response.status >= 400) {
      const error: any = new Error(`API request failed with status ${response.status}`)
      error.response = response
      throw error
    }

    return response.data
  })
}

