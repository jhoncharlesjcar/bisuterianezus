/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with a Map.
 * 
 * NOTE: For production at scale, consider @upstash/ratelimit with Redis.
 * This in-memory solution works well for single-instance deployments.
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}, 5 * 60 * 1000)

interface RateLimitOptions {
    /** Maximum number of requests allowed in the window */
    maxRequests: number
    /** Window duration in seconds */
    windowSeconds: number
}

interface RateLimitResult {
    success: boolean
    remaining: number
    resetIn: number
}

/**
 * Check rate limit for a given identifier (usually IP or user ID).
 */
export function checkRateLimit(
    identifier: string,
    options: RateLimitOptions = { maxRequests: 10, windowSeconds: 60 }
): RateLimitResult {
    const now = Date.now()
    const windowMs = options.windowSeconds * 1000
    const key = `${identifier}`

    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetTime) {
        // New window
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            success: true,
            remaining: options.maxRequests - 1,
            resetIn: options.windowSeconds,
        }
    }

    if (entry.count >= options.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetIn: Math.ceil((entry.resetTime - now) / 1000),
        }
    }

    entry.count++
    return {
        success: true,
        remaining: options.maxRequests - entry.count,
        resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }
    return request.headers.get("x-real-ip") || "unknown"
}
