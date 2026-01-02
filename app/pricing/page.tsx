'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthToken } from '@/lib/auth';
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
  const [couponCode, setCouponCode] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [currentPlan, setCurrentPlan] = useState<string>('');

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const token = getAuthToken();

    const fetchData = async () => {
      try {
        // Fetch plans
        const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pricing/plans`);
        const plansData = await plansResponse.json();
        setPlans(plansData);

        // Fetch current plan info
        const planInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/pricing/my-plan`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (planInfoResponse.ok) {
          const planInfo = await planInfoResponse.json();
          console.log('📊 Plan info response:', planInfo);
          console.log('📊 Current plan from API:', planInfo.plan?.name);
          setCurrentPlan(planInfo.plan?.name || 'free');
        } else {
          console.error('Failed to fetch plan info:', planInfoResponse.status);
          // Default to free if can't fetch
          setCurrentPlan('free');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponValidating(true);
    setCouponError('');

    const token = getAuthToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupon/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();

      if (response.ok) {
        setCouponDiscount(data.discountPercentage);
        alert('✅ ' + data.message);
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      setCouponError('Failed to validate coupon');
      setCouponDiscount(0);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleSubscribe = async (planId: string, planName: string, planPrice: number) => {
    console.log('🎯 handleSubscribe called with:', { planId, planName, planPrice });

    // Check if user is authenticated
    const token = getAuthToken();
    console.log('🔑 Token exists:', !!token);

    if (!token) {
      console.log('❌ No token found, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('⏳ Setting subscribing state to:', planId);
    setSubscribing(planId);

    try {
      if (planName === 'free') {
        console.log('🆓 Free plan selected');
        // Free plan - activate directly
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/activate-free`, {
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
          alert('⚠️ ' + (data.error || 'Failed to activate free plan'));
        }
        setSubscribing(null);
        return;
      }

      // Paid plans - use Razorpay
      console.log('💰 Paid plan selected - starting Razorpay flow');
      console.log('Creating Razorpay order for planId:', planId);
      console.log('Coupon code:', couponCode || 'none');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          couponCode: couponCode || undefined
        })
      });

      const orderData = await orderResponse.json();
      console.log('Order response:', orderData);

      if (!orderResponse.ok) {
        console.error('❌ Order creation failed:', orderData);
        const errorMsg = orderData.details || orderData.error || 'Failed to create payment order';
        alert('⚠️ ' + errorMsg + '\n\nCheck console and backend logs for details.');
        setSubscribing(null);
        return;
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        console.log('Loading Razorpay script...');
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        });
        console.log('Razorpay script loaded successfully');
      }

      // Open Razorpay checkout
      console.log('Opening Razorpay checkout with options...');
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Campaign Manager Pro',
        description: `${orderData.planName} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
                couponCode: couponCode || undefined
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              alert('✅ ' + verifyData.message);
              router.push('/dashboard');
            } else {
              alert('⚠️ Payment verification failed: ' + (verifyData.error || 'Unknown error'));
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('❌ Failed to verify payment. Please contact support.');
          } finally {
            setSubscribing(null);
          }
        },
        modal: {
          ondismiss: function() {
            setSubscribing(null);
          }
        },
        theme: {
          color: '#f97316' // Orange color matching the theme
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      console.log('Razorpay checkout opened');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('❌ Failed to process subscription. Please try again.');
      setSubscribing(null);
    } finally {
      // Note: Don't reset subscribing here as Razorpay modal handles it in ondismiss
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
            Try our platform with 5 free emails. Upgrade anytime to unlock more power.
          </p>

          {/* Coupon Code Input */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={validateCoupon}
                disabled={couponValidating || !couponCode.trim()}
                variant="outline"
                className="gap-2"
              >
                {couponValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-destructive mt-2">{couponError}</p>
            )}
            {couponDiscount > 0 && (
              <p className="text-sm text-green-600 mt-2 font-semibold">
                ✅ {couponDiscount}% discount applied!
              </p>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.name === 'starter';
            const isPro = plan.name === 'pro';
            const isCurrentPlan = plan.name === currentPlan;

            // Determine plan hierarchy for upgrade/downgrade logic
            const planHierarchy: { [key: string]: number } = { free: 0, starter: 1, pro: 2 };
            const currentPlanTier = planHierarchy[currentPlan] || 0;
            const thisPlanTier = planHierarchy[plan.name] || 0;
            const isDowngrade = thisPlanTier < currentPlanTier;

            if (plan.name === 'starter') {
              console.log('🔍 Checking starter plan - plan.name:', plan.name, 'currentPlan:', currentPlan, 'isCurrentPlan:', isCurrentPlan);
            }

            return (
              <Card
                key={plan._id}
                className={`border-2 relative ${
                  isCurrentPlan
                    ? 'border-green-500 shadow-2xl shadow-green-500/20 scale-105'
                    : isDowngrade
                    ? 'border-border shadow-lg opacity-60'
                    : isPro
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105'
                    : isPopular
                    ? 'border-orange-500/50 shadow-xl'
                    : 'border-border shadow-lg'
                }`}
              >
                {isCurrentPlan ? (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1 shadow-lg bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                ) : isPro ? (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1 shadow-lg">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                ) : null}

                <CardHeader className="text-center pb-8 pt-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white">
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.displayName}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>

                  <div className="mt-6">
                    {couponDiscount > 0 && plan.price > 0 ? (
                      <div>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-3xl font-bold line-through text-muted-foreground">
                            ₹{plan.price}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-center gap-2 mt-2">
                          <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                            ₹{Math.round(plan.price * (1 - couponDiscount / 100))}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="mt-1">
                          <Badge variant="default" className="bg-green-600">
                            {couponDiscount}% OFF
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                          ₹{plan.price}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    )}
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
                    onClick={() => handleSubscribe(plan._id, plan.name, plan.price)}
                    disabled={subscribing === plan._id || isCurrentPlan || isDowngrade}
                    variant={isCurrentPlan ? 'secondary' : isDowngrade ? 'outline' : getPlanVariant(plan.name)}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {subscribing === plan._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="h-4 w-4" />
                        Current Plan
                      </>
                    ) : isDowngrade ? (
                      <>
                        Not Available
                      </>
                    ) : plan.name === 'free' ? (
                      <>
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Upgrade
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
                  Start with 5 free emails per month. No credit card required. Test all features before upgrading.
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
