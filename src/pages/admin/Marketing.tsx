import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { CampaignDialog } from '@/components/admin/CampaignDialog';
import { LeadsManagement } from '@/components/admin/LeadsManagement';
import { LoyaltyManagement } from '@/components/admin/LoyaltyManagement';
import { MarketingAnalytics } from '@/components/admin/MarketingAnalytics';
import { CampaignsManagement } from '@/components/admin/CampaignsManagement';
import { BirthdayCustomers } from '@/components/admin/BirthdayCustomers';

interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  status: string;
  message_template: string;
  target_criteria: any;
  scheduled_date: string;
  created_at: string;
}

export default function Marketing() {
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingCampaign(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing & CRM</h1>
          <p className="text-muted-foreground">Gerencie campanhas e relacionamento com clientes</p>
        </div>
        <Button onClick={() => setCampaignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Gestão de Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="birthdays">Aniversários</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Points</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadsManagement />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsManagement onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="birthdays">
          <BirthdayCustomers />
        </TabsContent>

        <TabsContent value="loyalty">
          <LoyaltyManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <MarketingAnalytics />
        </TabsContent>
      </Tabs>

      <CampaignDialog
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
        onSuccess={handleDialogSuccess}
        editCampaign={editingCampaign}
      />
    </div>
  );
}