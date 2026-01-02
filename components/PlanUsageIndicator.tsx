'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, Infinity, Zap } from 'lucide-react';

interface PlanUsage {
  planDisplayName: string;
  emailLimit: number;
  isUnlimited: boolean;
  used: number;
  remaining: number;
  percentageUsed: number;
}

export default function PlanUsageIndicator() {
  const router = useRouter();
  const [usage, setUsage] = useState<PlanUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/plan-usage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (error) {
        console.error('Failed to fetch plan usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading || !usage) return null;

  const getProgressColor = () => {
    if (usage.isUnlimited) return 'bg-green-500';
    if (usage.percentageUsed >= 90) return 'bg-destructive';
    if (usage.percentageUsed >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (usage.isUnlimited) return 'success';
    if (usage.percentageUsed >= 90) return 'destructive';
    if (usage.percentageUsed >= 70) return 'warning';
    return 'secondary';
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10">
              {usage.isUnlimited ? (
                <Infinity className="h-4 w-4 text-primary" />
              ) : (
                <TrendingUp className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium truncate">{usage.planDisplayName}</p>
                <Badge variant={getStatusVariant()} className="text-xs">
                  {usage.isUnlimited ? 'Unlimited' : `${usage.percentageUsed}% Used`}
                </Badge>
              </div>
              {!usage.isUnlimited && (
                <>
                  <div className="w-full bg-accent rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor()}`}
                      style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usage.used} of {usage.emailLimit} emails used
                    {usage.remaining > 0 && ` • ${usage.remaining} remaining`}
                  </p>
                </>
              )}
              {usage.isUnlimited && (
                <p className="text-xs text-muted-foreground">No monthly limits</p>
              )}
            </div>
          </div>
          {!usage.isUnlimited && usage.percentageUsed >= 100 && (
            <Button
              onClick={() => router.push('/pricing')}
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-orange-600 hover:opacity-90"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Upgrade Plan</span>
              <span className="sm:hidden">Upgrade</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
