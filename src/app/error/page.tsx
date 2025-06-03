'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const errorMessages = {
    invalid_parameters: {
      title: 'Ongeldige Link',
      description: 'De verificatielink is ongeldig of beschadigd.',
      action: 'Vraag een nieuwe verificatiemail aan.'
    },
    invalid_type: {
      title: 'Ongeldig Verificatietype',
      description: 'Het type verificatie wordt niet herkend.',
      action: 'Controleer je email voor een nieuwe link.'
    },
    token_expired: {
      title: 'Link Verlopen',
      description: 'De verificatielink is verlopen.',
      action: 'Vraag een nieuwe verificatiemail aan.'
    },
    invalid_token: {
      title: 'Ongeldige Token',
      description: 'De verificatiecode is ongeldig of al gebruikt.',
      action: 'Vraag een nieuwe verificatiemail aan.'
    },
    verification_failed: {
      title: 'Verificatie Mislukt',
      description: 'Er ging iets mis tijdens de verificatie.',
      action: 'Probeer het opnieuw of neem contact op met support.'
    },
    unexpected_error: {
      title: 'Onverwachte Fout',
      description: 'Er is een onverwachte fout opgetreden.',
      action: 'Probeer het later opnieuw.'
    }
  }

  const error = errorMessages[message as keyof typeof errorMessages] || errorMessages.unexpected_error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{error.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{error.description}</p>
          <p className="mt-4 text-sm font-medium text-gray-700">{error.action}</p>
          
          <div className="mt-6 space-y-3">
            <a 
              href="/login" 
              className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ga naar Login
            </a>
            <a 
              href="/" 
              className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Terug naar Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}