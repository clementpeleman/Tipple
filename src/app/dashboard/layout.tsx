import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'; // Zorg ervoor dat je een server-client hebt

export const metadata: Metadata = {
  title: 'Tipple Dashboard',
  description: 'Wine managing dashboard',
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Maak een server-side Supabase client
  const supabase = createClient();
  
  // Check of de gebruiker is ingelogd
  const { data: { user } } = await (await supabase).auth.getUser();

  // Als de gebruiker niet is ingelogd, meteen redirecten
  if (!user) {
    redirect('/login');
  }

  // Persisting the sidebar state in the cookie.
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
