import { apiFetch } from '../../apiClient';
import { buildApiUrl } from '../../config';

/**
 * Tier System API
 * Handles tier listing, usage checking, and order management
 */

export interface Tier {
  id: number;
  platform: string;
  tier_name: string;
  tier_level: number;
  display_name: string;
  description: string | null;
  price_pkr: number;
  price_usd: number;
  posts_limit: number;
  post_scheduling_limit: number;
  edit_posts_limit: number;
  ai_generation_limit: number;
  image_generation_limit: number;
  image_editing_limit: number;
  features: string[] | null;
  is_active: boolean;
  is_unlimited: boolean;
}

export interface TierListResponse {
  success: boolean;
  message: string;
  platform: string;
  tiers: Tier[];
}

export interface UsageResponse {
  user_id: string;
  platform: string;
  current_tier_name: string;
  posts_remaining: number;
  post_scheduling_remaining: number;
  edit_posts_remaining: number;
  ai_generation_remaining: number;
  image_generation_remaining: number;
  image_editing_remaining: number;
  is_unlimited: boolean;
  total_posts_used: number;
  total_post_scheduling_used: number;
  total_edit_posts_used: number;
  total_ai_generation_used: number;
  total_image_generation_used: number;
  total_image_editing_used: number;
  tier_activated_at: string | null;
  credits_expire_at: string | null;
  is_expired: boolean;
}

export interface GetUsageResponse {
  success: boolean;
  message: string;
  usage: UsageResponse;
}

export interface OrderCreateRequest {
  platform: string;
  tier_id: number;
  transaction_id: string;
  sender_number: string;
  amount_paid: number;
  currency: string;
  user_notes?: string | null;
}

export interface Order {
  id: number;
  user_id: string;
  username: string | null;
  full_name: string | null;
  tier_id: number;
  platform: string;
  tier_name: string | null;
  transaction_id: string;
  sender_number: string;
  amount_paid: number;
  currency: string;
  payment_screenshot_url: string | null;
  status: string;
  is_approved: boolean;
  is_pending: boolean;
  is_rejected: boolean;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  user_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  total: number;
  orders: Order[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export interface UploadScreenshotResponse {
  success: boolean;
  message: string;
  screenshot_url: string;
}

/**
 * Get all tiers for a platform
 */
export async function getPlatformTiers(platform: string): Promise<TierListResponse> {
  return apiFetch<TierListResponse>(
    `/tiers/${platform}`,
    {
      method: 'GET',
    },
    { withAuth: false }, // Public endpoint
  );
}

/**
 * Get user's usage/credits for a platform
 */
export async function getUserUsage(platform: string): Promise<GetUsageResponse> {
  return apiFetch<GetUsageResponse>(
    `/usage/${platform}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );
}

/**
 * Check if user has credits for a specific operation
 */
export async function checkCredits(
  platform: string,
  credit_type: string
): Promise<{ has_credits: boolean; remaining: number; credit_type: string; message: string; is_unlimited: boolean }> {
  return apiFetch<{ has_credits: boolean; remaining: number; credit_type: string; message: string; is_unlimited: boolean }>(
    `/usage/${platform}/check/${credit_type}`,
    {
      method: 'GET',
    },
    { withAuth: true },
  );
}

/**
 * Create a payment order
 */
export async function createOrder(request: OrderCreateRequest): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>(
    '/orders',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
    { withAuth: true },
  );
}

/**
 * Upload payment screenshot for an order
 */
export async function uploadPaymentScreenshot(
  orderId: number,
  file: File
): Promise<UploadScreenshotResponse> {
  const formData = new FormData();
  formData.append('screenshot', file);

  return apiFetch<UploadScreenshotResponse>(
    `/orders/${orderId}/screenshot`,
    {
      method: 'POST',
      body: formData,
    },
    { withAuth: true },
  );
}

/**
 * Get user's orders
 */
export async function getMyOrders(platform?: string): Promise<OrderListResponse> {
  const url = platform ? `/orders/my-orders?platform=${platform}` : '/orders/my-orders';
  return apiFetch<OrderListResponse>(
    url,
    {
      method: 'GET',
    },
    { withAuth: true },
  );
}
