import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Validation: Check if required parameters are present
  if (!token_hash || !type) {
    console.error('Missing required parameters:', { token_hash: !!token_hash, type: !!type })
    redirect('/error?message=invalid_parameters')
  }

  // Validate the 'type' parameter
  const validTypes: EmailOtpType[] = ['signup', 'email_change', 'recovery', 'invite']
  if (!validTypes.includes(type)) {
    console.error('Invalid OTP type:', type)
    redirect('/error?message=invalid_type')
  }

  try {
    const supabase = await createClient()
    
    console.log('Verifying OTP:', { type, has_token: !!token_hash })
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('OTP verification failed:', error.message)
      
      // Handle specific error types
      if (error.message.includes('expired')) {
        redirect('/error?message=token_expired')
      } else if (error.message.includes('invalid')) {
        redirect('/error?message=invalid_token')
      } else {
        redirect('/error?message=verification_failed')
      }
    }

    // Success! Log and redirect
    console.log('OTP verification successful, redirecting to:', next)
    
    // Sanitize the redirect URL to prevent open redirects
    const sanitizedNext = sanitizeRedirectUrl(next)
    redirect(sanitizedNext)
    
  } catch (error) {
    console.error('Unexpected error during OTP verification:', error)
    redirect('/error?message=unexpected_error')
  }
}

/**
 * Sanitize redirect URL to prevent open redirect attacks
 */
function sanitizeRedirectUrl(url: string): string {
  // If it's a relative URL, it's safe
  if (url.startsWith('/')) {
    return url
  }
  
  // If it's an absolute URL, check if it's from the same origin
  try {
    const urlObj = new URL(url)
    const currentOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const allowedOrigin = new URL(currentOrigin).origin
    
    if (urlObj.origin === allowedOrigin) {
      return url
    }
  } catch {
    // Invalid URL, fall back to safe default
  }
  
  // Default safe redirect
  return '/'
}