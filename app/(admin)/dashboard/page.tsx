import { redirect } from 'next/navigation';
import { ADMIN_LOGIN_PATH, hasAdminAccess } from '@/src/entities/auth';

export default async function AdminPage() {
  if (!(await hasAdminAccess())) {
    const url = `${ADMIN_LOGIN_PATH}?error=unauthorized`;
    redirect(url);
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>admin</h1>
      <p>Welcome to the admin dashboard.</p>
    </div>
  );
}
