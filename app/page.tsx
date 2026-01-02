'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Mail,
  Clock,
  Zap,
  Target,
  Users,
  BarChart3,
  CheckCircle2,
  Calendar,
  Send,
  TrendingUp,
  Shield,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-orange-500/10">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Campaign Manager Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/pricing')} variant="ghost" className="gap-2">
              Pricing
            </Button>
            <Button onClick={() => router.push('/login')} variant="outline" className="gap-2">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/[0.02] bg-[size:50px_50px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              Smart Email Scheduling Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="block mb-2">Schedule Emails</span>
              <span className="bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">
                At The Perfect Time
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Send personalized email campaigns with precision timing. Schedule thousands of emails,
              track every delivery, and watch your engagement soar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={() => router.push('/pricing')}
                size="lg"
                className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6"
              >
                <Sparkles className="h-5 w-5" />
                View Pricing
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>5 free emails to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Upgrade anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-2 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground mt-2">Delivery Rate</div>
            </CardContent>
          </Card>
          <Card className="border-2 bg-gradient-to-br from-orange-500/10 to-transparent">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground mt-2">Emails/Hour</div>
            </CardContent>
          </Card>
          <Card className="border-2 bg-gradient-to-br from-green-500/10 to-transparent">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground mt-2">Automation</div>
            </CardContent>
          </Card>
          <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                &lt;1s
              </div>
              <div className="text-sm text-muted-foreground mt-2">Avg. Processing</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Primary Feature: Scheduling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Clock className="h-3 w-3 mr-2" />
            Flagship Feature
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Precision Email Scheduling
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule emails down to the exact minute. Perfect timing for maximum impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Individual Scheduling</h3>
                    <p className="text-muted-foreground">
                      Set unique send times for each recipient. Perfect for personalized campaigns across time zones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bulk Import & Schedule</h3>
                    <p className="text-muted-foreground">
                      Upload Excel files with thousands of recipients and their scheduled times in seconds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Smart Queue Management</h3>
                    <p className="text-muted-foreground">
                      Automatic retry for failed sends and intelligent queue processing ensures 100% delivery.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-primary/5 to-orange-500/5">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Campaign: Summer Sale</div>
                        <div className="text-sm text-muted-foreground">1,247 recipients</div>
                      </div>
                    </div>
                    <Badge variant="success">Scheduled</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded border border-dashed">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sending at 09:00 AM (342 emails)</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded border border-dashed">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sending at 02:00 PM (523 emails)</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded border border-dashed">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sending at 06:00 PM (382 emails)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Queue Status</span>
                      <span className="font-medium text-green-600">Processing (50/min)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-transparent to-primary/5 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to supercharge your email campaigns
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Campaign Management</h3>
              <p className="text-muted-foreground">
                Create, organize, and manage unlimited email campaigns with an intuitive dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recipient Management</h3>
              <p className="text-muted-foreground">
                Add, edit, and organize recipients individually or import thousands via Excel.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track sent, failed, and pending emails with live updates every 5 seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Send</h3>
              <p className="text-muted-foreground">
                Trigger emails immediately with the &quot;Send Now&quot; feature for urgent communications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Recovery</h3>
              <p className="text-muted-foreground">
                Automatic retry for failed emails and stuck queue recovery ensures maximum delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Google OAuth authentication and secure API ensure your data stays protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to your first scheduled campaign
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-orange-500 to-orange-600 opacity-20" style={{ top: '3rem' }} />

          <Card className="border-2 relative bg-gradient-to-br from-background to-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Campaign</h3>
              <p className="text-muted-foreground">
                Sign in with Google and create your first email campaign in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 relative bg-gradient-to-br from-background to-orange-500/5">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Recipients</h3>
              <p className="text-muted-foreground">
                Import from Excel or add individually with custom scheduled times for each.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 relative bg-gradient-to-br from-background to-green-500/5">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Sit Back & Relax</h3>
              <p className="text-muted-foreground">
                Watch your emails send automatically at the perfect time, every time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-2 shadow-2xl bg-gradient-to-br from-primary/10 via-orange-500/10 to-primary/10">
          <CardContent className="p-12 text-center">
            <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Schedule Smarter?
            </h2>
            <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
              Join thousands of users who trust our platform to deliver their emails at exactly the right moment.
            </p>
            <p className="text-lg text-green-600 font-semibold mb-8">
              Start with 5 free emails - No credit card required
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/pricing')}
                size="lg"
                className="gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/50"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Campaign Manager Pro - Smart Email Scheduling Platform</p>
          <p>Powered by precision timing and intelligent automation</p>
        </div>
      </footer>
    </div>
  );
}
