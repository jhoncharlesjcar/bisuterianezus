import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// A2: Middleware for protecting routes
export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
                        supabaseResponse.cookies.set(name, value, options as any)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Protected routes that require authentication
    const protectedRoutes = ["/admin", "/perfil"]
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    )

    if (isProtectedRoute && !user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/login"
        redirectUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // Admin routes require admin role
    if (pathname.startsWith("/admin") && user) {
        const { data: adminRole } = await supabase
            .from("admin_roles")
            .select("role")
            .eq("user_id", user.id)
            .single()

        if (!adminRole) {
            // Also check profiles fallback
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (profile?.role !== "admin") {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = "/"
                return NextResponse.redirect(redirectUrl)
            }
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/perfil/:path*",
    ],
}
