'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PlanUsageIndicator from '@/components/PlanUsageIndicator';
import { useGetUserProfileQuery } from '@/store/api';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Mail, BarChart3, Settings } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading, error } = useGetUserProfileQuery();

  console.log(process.env.NEXT_PUBLIC_API_URL,"process.env.NEXT_PUBLIC_API_URL")
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error ? 'Failed to load user profile' : 'User not found'}
          </p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',"env-backend")

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 border-2 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-1">{user.email}</p>
                <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <PlanUsageIndicator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Email Campaigns</h2>
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">Create and manage scheduled email campaigns</p>
              <Button
                onClick={() => router.push('/campaigns')}
                className="w-full"
              >
                Go to Campaigns
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Analytics</h2>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">Track email performance</p>
              <Badge variant="warning">Coming Soon</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Settings</h2>
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">Configure your account</p>
              <Badge variant="warning">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
