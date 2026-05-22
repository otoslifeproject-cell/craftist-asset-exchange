import Link from 'next/link';
import { requireAdmin } from '../../lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <main>
      <div className="shell">
        <nav className="nav">
          <Link href="/admin" className="brand">The Craftist Exchange</Link>
          <div className="navlinks">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/items/new">New asset</Link>
            <Link href="/admin/buyers">Buyers</Link>
            <Link href="/logout">Logout</Link>
          </div>
        </nav>
        {children}
      </div>
    </main>
  );
}
