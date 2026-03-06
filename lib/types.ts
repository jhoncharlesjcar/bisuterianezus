export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  category_id?: string
  category?: Category
  image_url?: string
  image_position?: string
  lifestyle_image_url?: string
  in_stock: boolean
  stock_quantity: number
  low_stock_threshold: number
  sku?: string
  featured: boolean
  created_at: string
  updated_at: string
  // Virtual field for average rating
  average_rating?: number
  review_count?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code?: string
  country: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id?: string
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  discount_amount: number
  shipping_cost: number
  total: number

  // Shipping info
  shipping_full_name: string
  shipping_phone?: string
  shipping_address_line1: string
  shipping_address_line2?: string
  shipping_city: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_country: string

  // Tracking info
  tracking_number?: string
  carrier?: string
  estimated_delivery?: string

  // Payment info
  payment_method?: string
  payment_status: "pending" | "paid" | "failed" | "refunded"

  // Coupon info
  coupon_code?: string

  notes?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderTracking {
  id: string
  order_id: string
  status: string
  title: string
  description?: string
  location?: string
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  product?: Product
  created_at: string
}

// ============================================
// REVIEWS SYSTEM TYPES
// ============================================

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  verified_purchase: boolean
  helpful_count: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  user?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface ReviewVote {
  id: string
  review_id: string
  user_id: string
  is_helpful: boolean
  created_at: string
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

// ============================================
// INVENTORY TYPES
// ============================================

export interface InventoryLog {
  id: string
  product_id: string
  quantity_change: number
  quantity_after: number
  reason: "restock" | "sale" | "adjustment" | "return" | "damaged"
  notes?: string
  user_id?: string
  created_at: string
}

// ============================================
// COUPON TYPES
// ============================================

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  amount: number
  min_purchase: number
  max_discount?: number
  usage_limit?: number
  usage_count: number
  user_usage_limit: number
  active: boolean
  starts_at?: string
  expires_at?: string
  description?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CouponUsage {
  id: string
  coupon_id: string
  user_id?: string
  order_id?: string
  discount_amount: number
  created_at: string
}

export interface CouponValidation {
  valid: boolean
  coupon?: Coupon
  discount_amount?: number
  error?: string
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminRole {
  id: string
  user_id: string
  role: "admin" | "super_admin"
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_revenue: number
  total_orders: number
  pending_orders: number
  low_stock_products: number
  total_customers: number
  pending_reviews: number
  revenue_today: number
  revenue_week: number
  revenue_month: number
  orders_today: number
  orders_week: number
  orders_month: number
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchFilters {
  query?: string
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  minRating?: number
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "rating_desc" | "newest"
}

export interface SearchResults {
  products: Product[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

