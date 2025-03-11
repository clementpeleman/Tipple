import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // This is where you can log cookies before updating session
  // console.log("Middleware - Cookies before session update:", request.cookies.getAll());
  
  const updatedResponse = await updateSession(request);
  
  // Log cookies after updating session to verify if they're being set correctly
  // console.log("Middleware - Cookies after session update:", updatedResponse.cookies.getAll());

  return updatedResponse;
}

export const config = {
  matcher: [
    '/api/:path*', // Protect API routes
    '/dashboard/:path*', // Protect dashboard routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)', // Exclude static assets and images
  ],
};
