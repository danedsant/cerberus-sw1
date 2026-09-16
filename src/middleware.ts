import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const protectedRoutes = ['/residente', '/vigilante', '/admin']
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // No autenticado en ruta protegida → login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Obtener rol del usuario
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', user?.id || '')
    .single()

  const rol = usuario?.rol

  // Validar rol por ruta
  if (pathname.startsWith('/residente') && rol !== 'residente') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/vigilante') && rol !== 'vigilante') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin') && !['administrativo', 'superadmin'].includes(rol || '')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Autenticado en /login → redirect a dashboard según rol
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    if (rol === 'residente') {
      url.pathname = '/residente'
    } else if (rol === 'vigilante') {
      url.pathname = '/vigilante'
    } else if (rol === 'administrativo' || rol === 'superadmin') {
      url.pathname = '/admin'
    } else {
      url.pathname = '/residente'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
