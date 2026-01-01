'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/ui/feature-card';
import { ArrowRight, Mail, BarChart3, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-orange-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Email Sender Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Send beautiful email campaigns with ease. Track performance, manage contacts, and grow your audience.
          </p>

          <Button
            onClick={() => router.push('/login')}
            size="lg"
            className="gap-2 text-lg px-8 py-6"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Mail}
            title="Email Campaigns"
            description="Create and send professional email campaigns to your subscribers with our intuitive editor."
          />

          <FeatureCard
            icon={BarChart3}
            title="Analytics"
            description="Track opens, clicks, and engagement metrics to optimize your email marketing strategy."
          />

          <FeatureCard
            icon={Users}
            title="Contact Management"
            description="Organize and segment your contacts to deliver targeted, personalized content."
          />
        </div>
      </div>
    </div>
  );
}
