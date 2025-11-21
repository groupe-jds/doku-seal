import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-border bg-card w-64 border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">Doku-Seal</h2>
        </div>
        <nav className="space-y-1 px-3">
          <Link href="/dashboard" className="hover:bg-accent block rounded-md px-3 py-2">
            Dashboard
          </Link>
          <Link href="/documents" className="hover:bg-accent block rounded-md px-3 py-2">
            Documents
          </Link>
          <Link href="/templates" className="hover:bg-accent block rounded-md px-3 py-2">
            Templates
          </Link>
          <Link href="/settings" className="hover:bg-accent block rounded-md px-3 py-2">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
