import { Button } from '@doku-seal/ui/primitives/button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Doku-Seal dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border-border bg-card rounded-lg border p-6">
          <h3 className="text-muted-foreground text-sm font-medium">Total Documents</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="border-border bg-card rounded-lg border p-6">
          <h3 className="text-muted-foreground text-sm font-medium">Pending Signatures</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="border-border bg-card rounded-lg border p-6">
          <h3 className="text-muted-foreground text-sm font-medium">Completed</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="flex gap-4">
          <Button>Create Document</Button>
          <Button variant="outline">Upload Template</Button>
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <p className="text-muted-foreground">No recent activity</p>
      </div>
    </div>
  );
}
