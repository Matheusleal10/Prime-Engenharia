import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Segurança</CardTitle>
        <CardDescription>
          Monitore e configure a segurança do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="rounded-lg border p-3 md:p-4">
            <h4 className="font-medium text-sm md:text-base">Sistema de Auditoria</h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              O sistema está registrando todas as ações importantes para auditoria e rastreabilidade.
            </p>
            <p className="text-xs md:text-sm text-green-600 mt-2">✓ Ativo</p>
          </div>
          <div className="rounded-lg border p-3 md:p-4">
            <h4 className="font-medium text-sm md:text-base">Validação de Estoque</h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              O sistema está validando automaticamente os níveis de estoque antes das movimentações.
            </p>
            <p className="text-xs md:text-sm text-green-600 mt-2">✓ Ativo</p>
          </div>
          <div className="rounded-lg border p-3 md:p-4">
            <h4 className="font-medium text-sm md:text-base">Controle de Acesso</h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Row Level Security (RLS) está ativo para proteger os dados do sistema.
            </p>
            <p className="text-xs md:text-sm text-green-600 mt-2">✓ Ativo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}