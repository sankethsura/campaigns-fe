'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Mail,
  Loader2
} from 'lucide-react';

interface Plan {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  emailLimit: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pricing/plans`);
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string, planName: string) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (planName === 'free') {
      // Free plan - just redirect to dashboard
      router.push('/dashboard');
      return;
    }

    setSubscribing(planId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pricing/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ' + data.message);
        router.push('/dashboard');
      } else {
        alert('⚠️ ' + (data.error || 'Failed to submit subscription request'));
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('❌ Failed to submit subscription request. Please try again.');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'free':
        return <Sparkles className="h-6 w-6" />;
      case 'starter':
        return <Zap className="h-6 w-6" />;
      case 'pro':
        return <Crown className="h-6 w-6" />;
      default:
        return <Mail className="h-6 w-6" />;
    }
  };

  const getPlanVariant = (planName: string): "default" | "outline" | "secondary" => {
    switch (planName) {
      case 'pro':
        return 'default';
      case 'starter':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-orange-500/10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-orange-500/10">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-2" />
            Transparent Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block mb-2">Choose Your Plan</span>
            <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Start Free, Scale Anytime
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Try our platform with 20 free emails. Upgrade anytime to unlock more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.name === 'starter';
            const isPro = plan.name === 'pro';

            return (
              <Card
                key={plan._id}
                className={`border-2 relative ${
                  isPro
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105'
                    : isPopular
                    ? 'border-orange-500/50 shadow-xl'
                    : 'border-border shadow-lg'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1 shadow-lg">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white">
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.displayName}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {plan.emailLimit === -1 ? (
                        <span className="font-semibold text-green-600">Unlimited emails</span>
                      ) : (
                        <span>{plan.emailLimit.toLocaleString()} emails/month</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    onClick={() => handleSubscribe(plan._id, plan.name)}
                    disabled={subscribing === plan._id}
                    variant={getPlanVariant(plan.name)}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {subscribing === plan._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : plan.name === 'free' ? (
                      <>
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start with 20 free emails per month. No credit card required. Test all features before upgrading.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Contact us to change your plan. We&apos;ll adjust your billing accordingly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens after I submit a subscription request?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We&apos;ll receive your request and contact you within 24 hours to complete the setup and payment process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">Not sure which plan is right for you?</p>
          <Button onClick={() => router.push('/login')} variant="outline" size="lg" className="gap-2">
            Start with Free Trial
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
