/**
 * Klarna Payments API Client
 * 
 * This module provides a wrapper around the Klarna Payments API
 * for creating payment sessions and managing orders.
 * 
 * Documentation: https://docs.klarna.com/api/payments/
 */

import axios, { AxiosInstance } from 'axios'

// Klarna API Configuration
const KLARNA_API_BASE_URL = process.env.KLARNA_API_BASE_URL || 'https://api.playground.klarna.com' // Use playground for testing
const KLARNA_USERNAME = process.env.KLARNA_USERNAME || ''
const KLARNA_PASSWORD = process.env.KLARNA_PASSWORD || ''

// Types
export interface KlarnaOrderLine {
  type?: 'physical' | 'digital' | 'shipping_fee' | 'discount'
  reference?: string
  name: string
  quantity: number
  unit_price: number // Amount in minor units (cents)
  tax_rate?: number
  total_amount: number
  total_tax_amount?: number
  image_url?: string
}

export interface KlarnaCustomer {
  date_of_birth?: string
  title?: string
  given_name?: string
  family_name?: string
  email?: string
  phone?: string
}

export interface KlarnaAddress {
  given_name?: string
  family_name?: string
  email?: string
  title?: string
  street_address?: string
  street_address2?: string
  postal_code?: string
  city?: string
  region?: string
  phone?: string
  country: string
}

export interface KlarnaSessionRequest {
  purchase_country: string
  purchase_currency: string
  locale: string
  order_amount: number // Total amount in minor units (cents)
  order_tax_amount?: number
  order_lines: KlarnaOrderLine[]
  merchant_urls?: {
    terms?: string
    checkout?: string
    confirmation?: string
    push?: string // Webhook URL
  }
  billing_address?: KlarnaAddress
  shipping_address?: KlarnaAddress
  customer?: KlarnaCustomer
  merchant_reference1?: string
  merchant_reference2?: string
}

export interface KlarnaSessionResponse {
  session_id: string
  client_token: string
  payment_method_categories?: Array<{
    identifier: string
    name: string
    asset_urls?: {
      descriptive?: string
      standard?: string
    }
  }>
}

export interface KlarnaOrderRequest {
  purchase_country: string
  purchase_currency: string
  locale: string
  order_amount: number
  order_tax_amount?: number
  order_lines: KlarnaOrderLine[]
  merchant_urls: {
    terms: string
    checkout: string
    confirmation: string
    push: string
  }
  merchant_reference1?: string
  merchant_reference2?: string
  billing_address?: KlarnaAddress
  shipping_address?: KlarnaAddress
  customer?: KlarnaCustomer
}

export interface KlarnaOrderResponse {
  order_id: string
  status: 'AUTHORIZED' | 'PART_CAPTURED' | 'CAPTURED' | 'CANCELLED' | 'EXPIRED'
  fraud_status?: string
  authorized_payment_method?: {
    type: string
    description: string
  }
  order_amount: number
  order_tax_amount?: number
  order_lines: KlarnaOrderLine[]
  billing_address?: KlarnaAddress
  shipping_address?: KlarnaAddress
  customer?: KlarnaCustomer
  merchant_reference1?: string
  merchant_reference2?: string
  created_at?: string
  expires_at?: string
}

/**
 * Klarna API Client
 */
class KlarnaClient {
  private client: AxiosInstance

  constructor() {
    // Create axios instance with basic auth
    this.client = axios.create({
      baseURL: KLARNA_API_BASE_URL,
      auth: {
        username: KLARNA_USERNAME,
        password: KLARNA_PASSWORD,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Create a new payment session
   * This is the first step in the Klarna payment flow
   */
  async createSession(data: KlarnaSessionRequest): Promise<KlarnaSessionResponse> {
    try {
      const response = await this.client.post('/payments/v1/sessions', data)
      return response.data
    } catch (error: any) {
      console.error('Klarna create session error:', error.response?.data || error.message)
      throw new Error(`Failed to create Klarna session: ${error.response?.data?.error_message || error.message}`)
    }
  }

  /**
   * Create an order after payment authorization
   * This finalizes the payment and creates an order
   */
  async createOrder(authorizationToken: string, data: KlarnaOrderRequest): Promise<KlarnaOrderResponse> {
    try {
      const response = await this.client.post(
        `/payments/v1/authorizations/${authorizationToken}/order`,
        data
      )
      return response.data
    } catch (error: any) {
      console.error('Klarna create order error:', error.response?.data || error.message)
      throw new Error(`Failed to create Klarna order: ${error.response?.data?.error_message || error.message}`)
    }
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<KlarnaOrderResponse> {
    try {
      const response = await this.client.get(`/ordermanagement/v1/orders/${orderId}`)
      return response.data
    } catch (error: any) {
      console.error('Klarna get order error:', error.response?.data || error.message)
      throw new Error(`Failed to get Klarna order: ${error.response?.data?.error_message || error.message}`)
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.client.post(`/ordermanagement/v1/orders/${orderId}/cancel`)
    } catch (error: any) {
      console.error('Klarna cancel order error:', error.response?.data || error.message)
      throw new Error(`Failed to cancel Klarna order: ${error.response?.data?.error_message || error.message}`)
    }
  }

  /**
   * Capture an order (charge the customer)
   */
  async captureOrder(orderId: string, captureData?: {
    captured_amount?: number
    description?: string
    order_lines?: KlarnaOrderLine[]
  }): Promise<void> {
    try {
      await this.client.post(`/ordermanagement/v1/orders/${orderId}/captures`, captureData || {})
    } catch (error: any) {
      console.error('Klarna capture order error:', error.response?.data || error.message)
      throw new Error(`Failed to capture Klarna order: ${error.response?.data?.error_message || error.message}`)
    }
  }

  /**
   * Refund an order
   */
  async refundOrder(orderId: string, refundData: {
    refunded_amount: number
    description?: string
    order_lines?: KlarnaOrderLine[]
  }): Promise<void> {
    try {
      await this.client.post(`/ordermanagement/v1/orders/${orderId}/refunds`, refundData)
    } catch (error: any) {
      console.error('Klarna refund order error:', error.response?.data || error.message)
      throw new Error(`Failed to refund Klarna order: ${error.response?.data?.error_message || error.message}`)
    }
  }
}

// Export singleton instance
export const klarnaClient = new KlarnaClient()

/**
 * Helper function to convert dollars to cents (minor units)
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Helper function to convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100
}

/**
 * Helper function to format price for display
 */
export function formatPrice(cents: number, currency: string = 'USD'): string {
  const dollars = centsToDollars(cents)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars)
}

