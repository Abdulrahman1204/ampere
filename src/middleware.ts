import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const jwtToken = request.cookies.get('jwtToken');
    const token = jwtToken?.value as string;

    const { pathname } = request.nextUrl;

    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/'
    ]
}