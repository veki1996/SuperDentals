import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	function middleware(req) {
		return NextResponse.rewrite(new URL(req.url));
	},
	{
		callbacks: {
			authorized({ token, req }) {
				const pathname = req.nextUrl.pathname;
				req.nextUrl.pathname;
				if (pathname.startsWith('/admin')) {
					return token?.role === 'ADMIN';
				}
				if (
					pathname.startsWith('/settings') ||
					pathname.startsWith('/create-clinic') ||
					pathname.startsWith('/packages') ||
					pathname.startsWith('/payment')
				) {
					if (token) return true;
				}
			},
		},
	},
);

export const config = { matcher: ['/admin/:path*', '/settings/:path*', '/create-clinic', '/packages', '/payment'] };
