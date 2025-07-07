import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Settings as SettingsIcon, Shield } from 'lucide-react';
import { CompanySettings } from '@/components/admin/settings/CompanySettings';
import { SystemSettings } from '@/components/admin/settings/SystemSettings';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { useSettings } from '@/hooks/useSettings';

export default function Settings() {
  const {
    settings,
    setSettings,
    loading,
    saving,
    saveCompanySettings,
    saveSystemSettings,
    toggleSetting
  } = useSettings();

  if (loading) {
    return <div className="text-center py-8">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">Configurações</h1>
        <p className="text-sm md:text-base text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center justify-center space-x-1 md:space-x-2">
            <Building className="h-4 w-4" />
            <span className="text-xs md:text-sm">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center justify-center space-x-1 md:space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="text-xs md:text-sm">Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center space-x-1 md:space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs md:text-sm">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={saveCompanySettings}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={saveSystemSettings}
            onToggleSetting={toggleSetting}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}