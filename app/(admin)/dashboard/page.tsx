import { redirect } from 'next/navigation';
import { auth, hasAdminAccess } from '@/src/entities/auth';

export default async function AdminPage() {
  const session = await auth();

  if (!hasAdminAccess(session?.user ?? null)) {
    redirect('/login?error=unauthorized');
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>admin</h1>
      <p>Welcome to the admin dashboard.</p>
    </div>
  );
}
