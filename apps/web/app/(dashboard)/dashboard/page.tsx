import { auth } from '@/lib/auth/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name || session?.user?.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-doku-seal">0</p>
            <p className="text-sm text-gray-500 mt-2">Total documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envelopes</CardTitle>
            <CardDescription>Track your envelopes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-doku-seal">0</p>
            <p className="text-sm text-gray-500 mt-2">Active envelopes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Your saved templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-doku-seal">0</p>
            <p className="text-sm text-gray-500 mt-2">Available templates</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Email:</span>{' '}
              <span className="text-gray-600">{session?.user?.email}</span>
            </div>
            <div>
              <span className="font-medium">Name:</span>{' '}
              <span className="text-gray-600">{session?.user?.name || 'Not set'}</span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>{' '}
              <span className="text-gray-600">{session?.user?.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
