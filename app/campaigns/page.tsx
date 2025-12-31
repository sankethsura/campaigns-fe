'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCampaignsQuery, useCreateCampaignMutation, useDeleteCampaignMutation, useGetUserProfileQuery } from '@/store/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Mail, Trash2, Eye, Calendar, Users, Send, AlertCircle, Loader2 } from 'lucide-react';

export default function CampaignsPage() {
  const router = useRouter();
  const { data: user } = useGetUserProfileQuery();
  const { data: campaigns = [], isLoading } = useGetCampaignsQuery(undefined, {
    pollingInterval: 5000, // Poll every 5 seconds
  });
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
  });

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCampaign.name.trim()) {
      alert('Campaign name is required');
      return;
    }

    try {
      const campaign = await createCampaign({
        name: newCampaign.name,
        description: newCampaign.description || undefined,
      }).unwrap();

      setNewCampaign({ name: '', description: '' });
      setShowCreateForm(false);

      router.push(`/campaigns/${campaign._id}`);
    } catch (error: any) {
      console.error('Failed to create campaign:', error);
      alert(error?.data?.message || 'Failed to create campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string, campaignName: string) => {
    if (!confirm(`Are you sure you want to delete "${campaignName}"? This will also delete all recipients.`)) {
      return;
    }

    try {
      await deleteCampaign(campaignId).unwrap();
    } catch (error: any) {
      console.error('Failed to delete campaign:', error);
      alert(error?.data?.message || 'Failed to delete campaign');
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2">
              Email Campaigns
            </h1>
            <p className="text-muted-foreground">Manage and track your email campaigns</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="lg"
            className="gap-2"
          >
            {showCreateForm ? (
              <>
                <X className="h-5 w-5" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Campaign
              </>
            )}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Create New Campaign
              </CardTitle>
              <CardDescription>
                Start a new email campaign to reach your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Campaign Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="e.g., Summer Newsletter 2025"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <Textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    rows={3}
                    placeholder="Brief description of this campaign..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Campaign
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="border-2 border-dashed shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="mb-2">No campaigns yet</CardTitle>
              <CardDescription className="mb-6 text-center max-w-md">
                Get started by creating your first email campaign to engage with your audience
              </CardDescription>
              <Button
                onClick={() => setShowCreateForm(true)}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign._id}
                className="border-2 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                onClick={() => router.push(`/campaigns/${campaign._id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                        {campaign.name}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {campaign.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {campaign.description && (
                    <CardDescription className="line-clamp-2 mt-2">
                      {campaign.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Total Recipients
                    </span>
                    <span className="font-semibold">{campaign.totalRecipients}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Send className="h-4 w-4" />
                      Sent
                    </span>
                    <span className="font-semibold text-green-600">{campaign.sentCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      Failed
                    </span>
                    <span className="font-semibold text-destructive">{campaign.failedCount}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Created: {formatDate(campaign.createdAt)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-accent/50 flex justify-between gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/campaigns/${campaign._id}`);
                    }}
                    variant="ghost"
                    size="sm"
                    className="gap-2 flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCampaign(campaign._id, campaign.name);
                    }}
                    disabled={isDeleting}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
