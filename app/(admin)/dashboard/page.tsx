import {
  AdminDashboardView,
  type AdminDashboardQueryParams,
} from '@/src/views/admin-dashboard-view';

export const instant = false;

type SearchParams = Promise<AdminDashboardQueryParams>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  return <AdminDashboardView searchParams={resolvedSearchParams} />;
}
