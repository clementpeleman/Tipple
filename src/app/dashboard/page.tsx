'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // console.log('Dashboard: User', user);

      if (!user) {
        console.log('Dashboard: Redirecting to home');
        router.push('/login');
      } else {
        console.log('Dashboard: Redirecting to overview');
        router.push('/dashboard/overview');
      }
    };

    fetchUser();
  }, []);

  return <div>Loading...</div>; // Eventueel een loading state tonen
}
