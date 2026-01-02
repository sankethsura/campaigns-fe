'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Zap, Crown, TrendingUp, Check } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  usageInfo?: {
    planLimit: number;
    currentCount: number;
    remaining?: number;
  };
  message?: string;
}

export default function UpgradeModal({ isOpen, onClose, currentPlan, usageInfo, message }: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const planFeatures = {
    starter: [
      '1,000 emails per month',
      'Advanced campaign management',
      'Real-time tracking & analytics',
      'Precision email scheduling',
      'Priority support'
    ],
    pro: [
      'Unlimited emails',
      'Advanced campaign management',
      'Real-time tracking & analytics',
      'Precision email scheduling',
      'Premium priority support',
      'Custom features on request'
    ]
  };

  const recommendedPlan = currentPlan === 'free' ? 'starter' : 'pro';
  const features = planFeatures[recommendedPlan as keyof typeof planFeatures];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="max-w-lg w-full border-2 shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20">
              {recommendedPlan === 'starter' ? (
                <Zap className="h-6 w-6 text-primary" />
              ) : (
                <Crown className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">Upgrade Your Plan</CardTitle>
              <Badge variant="warning" className="mt-1">Limit Reached</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Usage */}
          {usageInfo && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-destructive mb-1">
                    Plan Limit Reached
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {message || `You've used ${usageInfo.currentCount} of ${usageInfo.planLimit} emails in your current plan.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Plan */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>Recommended:</span>
              <Badge variant="default" className="bg-gradient-to-r from-primary to-orange-600">
                {recommendedPlan === 'starter' ? 'Starter Plan' : 'Pro Plan'}
              </Badge>
            </h3>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10 border">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starting at</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                  ₹{recommendedPlan === 'starter' ? '599' : '1,299'}
                </p>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>
              <Badge variant="secondary" className="bg-green-600 text-white">
                Save up to 99% with coupon!
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              onClose();
              router.push('/pricing');
            }}
            className="w-full sm:flex-1 gap-2 bg-gradient-to-r from-primary to-orange-600 hover:opacity-90"
          >
            {recommendedPlan === 'starter' ? <Zap className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
            View Pricing Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
