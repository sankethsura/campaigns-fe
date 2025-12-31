'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { isAuthenticated } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-orange-500/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/50 mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2">
            Campaign Manager Pro
          </h1>
          <p className="text-muted-foreground">
            Sophisticated email campaign management
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GoogleLoginButton />

            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">1M+</div>
            <div className="text-xs text-muted-foreground">Emails Sent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
