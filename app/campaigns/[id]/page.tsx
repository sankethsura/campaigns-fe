'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetCampaignByIdQuery,
  useGetCampaignRecipientsQuery,
  useAddRecipientMutation,
  useGetUserProfileQuery,
  useRecalculateCampaignCountsMutation,
} from '@/store/api';
import { isAuthenticated } from '@/lib/auth';
import RecipientsTable from '@/components/RecipientsTable';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  Send,
  AlertCircle,
  Mail,
  Plus,
  X,
  Calendar,
  FileSpreadsheet,
  Loader2,
  UserPlus,
  RefreshCw
} from 'lucide-react';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  const { data: user } = useGetUserProfileQuery();
  const { data: campaign, isLoading: campaignLoading } = useGetCampaignByIdQuery(campaignId, {
    pollingInterval: 5000, // Poll every 5 seconds
  });

  const [currentPage, setCurrentPage] = useState(1);
  const { data: recipientsData, isLoading: recipientsLoading, refetch } = useGetCampaignRecipientsQuery({
    campaignId,
    page: currentPage,
    limit: 10
  }, {
    pollingInterval: 5000, // Poll every 5 seconds
  });

  const [addRecipient, { isLoading: isAdding }] = useAddRecipientMutation();
  const [recalculateCounts, { isLoading: isRecalculating }] = useRecalculateCampaignCountsMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    message: '',
    triggerDate: '',
  });

  console.log(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',"env-backend")

  // Convert local datetime-local string to UTC ISO string
  const toUTCString = (localDateTimeString: string): string => {
    const date = new Date(localDateTimeString);
    return date.toISOString();
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRecipient.email || !newRecipient.message || !newRecipient.triggerDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await addRecipient({
        campaignId,
        data: {
          email: newRecipient.email,
          message: newRecipient.message,
          triggerDate: toUTCString(newRecipient.triggerDate),
        },
      }).unwrap();

      setNewRecipient({ email: '', message: '', triggerDate: '' });
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      console.error('Failed to add recipient:', error);
      alert(error?.data?.message || 'Failed to add recipient');
    }
  };

  const handleRecalculateCounts = async () => {
    try {
      await recalculateCounts(campaignId).unwrap();
      alert('Campaign counts recalculated successfully!');
    } catch (error: any) {
      console.error('Failed to recalculate counts:', error);
      alert(error?.data?.message || 'Failed to recalculate counts');
    }
  };

  if (!user || campaignLoading || recipientsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar user={user} />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <div className="text-2xl font-semibold text-destructive">Campaign not found</div>
          <Button onClick={() => router.push('/campaigns')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
    const variants = {
      draft: 'secondary' as const,
      scheduled: 'info' as const,
      in_progress: 'warning' as const,
      completed: 'success' as const,
      paused: 'destructive' as const,
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => router.push('/campaigns')}
            variant="ghost"
            className="mb-4 gap-2 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-6 w-6 text-primary" />
                    <CardTitle className="text-3xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                      {campaign.name}
                    </CardTitle>
                  </div>
                  {campaign.description && (
                    <CardDescription className="text-base mt-2">
                      {campaign.description}
                    </CardDescription>
                  )}
                </div>
                <Badge variant={getStatusVariant(campaign.status)} className="text-sm px-3 py-1">
                  {campaign.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 bg-accent/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Recipients</p>
                        <p className="text-3xl font-bold">{campaign.totalRecipients}</p>
                      </div>
                      <Users className="h-10 w-10 text-primary opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 bg-green-500/10 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Sent</p>
                        <p className="text-3xl font-bold text-green-600">{campaign.sentCount}</p>
                      </div>
                      <Send className="h-10 w-10 text-green-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 bg-destructive/10 border-destructive/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Failed</p>
                        <p className="text-3xl font-bold text-destructive">{campaign.failedCount}</p>
                      </div>
                      <AlertCircle className="h-10 w-10 text-destructive opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleRecalculateCounts}
                  disabled={isRecalculating}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {isRecalculating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Recalculating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Refresh Counts
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <CardTitle>Import Recipients from Excel</CardTitle>
              </div>
              <Badge variant="warning">Coming Soon</Badge>
            </div>
            <CardDescription className="mt-2">
              Bulk import recipients from Excel files with columns:{' '}
              <code className="px-1.5 py-0.5 bg-accent rounded text-xs font-mono">email</code>,{' '}
              <code className="px-1.5 py-0.5 bg-accent rounded text-xs font-mono">triggerDate</code>{' '}
              (YYYY-MM-DD HH:MM),{' '}
              <code className="px-1.5 py-0.5 bg-accent rounded text-xs font-mono">message</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center bg-accent/30">
              <FileSpreadsheet className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="font-medium text-muted-foreground mb-1">Excel Import Feature</p>
              <p className="text-sm text-muted-foreground/70">This feature will be available soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>
                  Recipients ({recipientsData?.pagination.totalRecipients || 0})
                </CardTitle>
              </div>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "default"}
                className="gap-2"
              >
                {showAddForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Add Recipient
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          {showAddForm && (
            <CardContent className="border-t bg-accent/30">
              <form onSubmit={handleAddRecipient} className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      value={newRecipient.email}
                      onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Trigger Date & Time <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="datetime-local"
                      value={newRecipient.triggerDate}
                      onChange={(e) => setNewRecipient({ ...newRecipient, triggerDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={newRecipient.message}
                    onChange={(e) => setNewRecipient({ ...newRecipient, message: e.target.value })}
                    rows={4}
                    placeholder="Email message content..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="gap-2"
                  variant="default"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Recipient
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          )}

          <CardContent className={showAddForm ? "pt-6 border-t" : ""}>
            <RecipientsTable
              campaignId={campaignId}
              recipients={recipientsData?.recipients || []}
              pagination={recipientsData?.pagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
