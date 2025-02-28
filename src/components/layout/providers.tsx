'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { createClient } from '@/utils/supabase/client';
import { AuthProvider } from '@/lib/auth/AuthProvider';

const supabase = createClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>
      <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          {children}
      </ThemeProvider>
    // </AuthProvider>
  );
}
