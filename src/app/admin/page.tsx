import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== 'true') {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
