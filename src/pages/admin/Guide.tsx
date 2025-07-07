import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Megaphone,
  FileText,
  Settings,
  BarChart3,
  MessageCircle,
  Star,
  AlertTriangle,
  Clock,
  Calendar,
  Target
} from 'lucide-react';

export default function Guide() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Guia de Uso do Sistema
        </h1>
        <p className="text-muted-foreground">
          Manual completo para utilizar todas as funcionalidades do ERP Prime Engenharia
        </p>
      </div>

      <div className="grid gap-6">
        {/* Visão Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Visão Geral do Sistema
            </CardTitle>
            <CardDescription>
              O sistema Prime ERP é uma solução completa para gerenciar todos os aspectos do seu negócio de construção civil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integra vendas, estoque, clientes, financeiro e marketing em uma única plataforma, 
              desde a captação de leads no site até a entrega do produto e fidelização do cliente.
            </p>
          </CardContent>
        </Card>

        {/* Accordion com todas as seções */}
        <Accordion type="single" collapsible className="space-y-4">
          
          {/* Site Principal */}
          <AccordionItem value="site" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Site Principal - Captação de Leads
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Formulário "Solicite seu Orçamento"</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Visitantes preenchem: nome, email, telefone, tipo de projeto, quantidade</li>
                    <li>• Dados vão automaticamente para o sistema ERP</li>
                    <li>• Cliente recebe confirmação por email</li>
                    <li>• WhatsApp abre com mensagem pré-definida</li>
                    <li>• Equipe recebe notificação por email</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Botão WhatsApp Flutuante</h4>
                  <p className="text-sm text-muted-foreground">
                    Conecta diretamente com o número (98) 98710-8157 em todas as páginas
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dashboard */}
          <AccordionItem value="dashboard" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Dashboard Principal
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Cartões de Estatísticas</h4>
                  <p className="text-sm text-muted-foreground">
                    Total de clientes, pedidos, produtos e faturamento
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Gráficos</h4>
                  <p className="text-sm text-muted-foreground">
                    Vendas mensais e produtos mais vendidos
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Alertas</h4>
                  <p className="text-sm text-muted-foreground">
                    Produtos com estoque baixo e pedidos pendentes
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Atividades Recentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Últimos pedidos e leads recebidos
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gestão de Clientes */}
          <AccordionItem value="customers" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão de Clientes
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Visualizar Clientes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Lista completa com nome, email, telefone, tipo, pontos</li>
                    <li>• Filtros por nome, email ou documento</li>
                    <li>• Busca rápida integrada</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cadastrar Novo Cliente</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Dados pessoais completos e endereço</li>
                    <li>• Preferências de comunicação (email, SMS, WhatsApp)</li>
                    <li>• Sistema atribui automaticamente 0 pontos iniciais</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Marketing e CRM */}
          <AccordionItem value="marketing" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Marketing e CRM
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Leads</Badge>
                    Gestão de Leads
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Status: Novo → Contatado → Qualificado → Convertido/Perdido</li>
                    <li>• Contato direto via WhatsApp</li>
                    <li>• Conversão automática para cliente</li>
                    <li>• Taxa de conversão calculada automaticamente</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Campanhas</Badge>
                    Tipos de Campanha
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded border">
                      <p className="font-medium text-sm">Aniversário</p>
                      <p className="text-xs text-muted-foreground">Parabenizar clientes</p>
                    </div>
                    <div className="p-3 rounded border">
                      <p className="font-medium text-sm">Cashback</p>
                      <p className="text-xs text-muted-foreground">Pontos e descontos</p>
                    </div>
                    <div className="p-3 rounded border">
                      <p className="font-medium text-sm">Promocional</p>
                      <p className="text-xs text-muted-foreground">Divulgar produtos/serviços</p>
                    </div>
                    <div className="p-3 rounded border">
                      <p className="font-medium text-sm">Personalizada</p>
                      <p className="text-xs text-muted-foreground">Situações específicas</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Sistema de Fidelidade
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Transações: Ganhou, Bônus, Resgate, Expiração</li>
                    <li>• Saldo atualizado automaticamente</li>
                    <li>• Histórico completo de movimentações</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Produtos e Estoque */}
          <AccordionItem value="products" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestão de Produtos e Estoque
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cadastro de Produtos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• SKU gerado automaticamente se não informado</li>
                    <li>• Preços: venda e custo</li>
                    <li>• Controle de estoque: atual, mínimo, máximo</li>
                    <li>• Categorização para organização</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Controle de Estoque</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Alertas automáticos para estoque baixo</li>
                    <li>• Movimentações registradas automaticamente</li>
                    <li>• Entrada, saída e ajustes manuais</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pedidos */}
          <AccordionItem value="orders" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Gestão de Pedidos
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Fluxo de Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Rascunho</Badge>
                    <span>→</span>
                    <Badge variant="outline">Pendente</Badge>
                    <span>→</span>
                    <Badge variant="outline">Confirmado</Badge>
                    <span>→</span>
                    <Badge variant="outline">Entregue</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Funcionalidades</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Cálculo automático de totais</li>
                    <li>• Controle de endereço e data de entrega</li>
                    <li>• Geração de nota fiscal integrada</li>
                    <li>• Atualização automática de estoque</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Financeiro */}
          <AccordionItem value="financial" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gestão Financeira
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Transações</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Receitas e despesas categorizadas</li>
                    <li>• Associação com clientes e fornecedores</li>
                    <li>• Controle de vencimentos e pagamentos</li>
                    <li>• Relatórios por categoria e período</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Notas Fiscais */}
          <AccordionItem value="invoices" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas Fiscais
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Criação</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Manual através do menu</li>
                    <li>• Automática a partir de pedidos</li>
                    <li>• Numeração sequencial automática</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Exportação</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• PDF para impressão e envio</li>
                    <li>• Excel para análises</li>
                    <li>• XML para integração fiscal</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rotina Diária */}
          <AccordionItem value="routine" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rotina de Uso Recomendada
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Manhã (9h)</Badge>
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Verificar Dashboard para alertas</li>
                    <li>• Conferir novos leads</li>
                    <li>• Responder leads via WhatsApp</li>
                    <li>• Atualizar status dos leads contatados</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Durante o dia</Badge>
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Cadastrar novos pedidos</li>
                    <li>• Atualizar status dos pedidos</li>
                    <li>• Registrar movimentações de estoque</li>
                    <li>• Lançar transações financeiras</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Badge variant="secondary">Final do dia (17h)</Badge>
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Converter leads qualificados</li>
                    <li>• Gerar notas fiscais</li>
                    <li>• Verificar produtos com estoque baixo</li>
                    <li>• Backup de dados importantes</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Problemas Comuns */}
          <AccordionItem value="troubleshooting" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Resolução de Problemas
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Lead não apareceu no sistema</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Verificar conexão com internet</li>
                    <li>• Conferir email de notificação</li>
                    <li>• Leads ficam em Marketing → Gestão de Leads</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Erro ao gerar nota fiscal</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Verificar dados completos do cliente</li>
                    <li>• Confirmar produtos no pedido</li>
                    <li>• Entrar em contato com suporte</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* Informações de Suporte */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageCircle className="h-5 w-5" />
              Suporte e Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>WhatsApp:</strong> (98) 98710-8157
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Para dúvidas ou problemas técnicos, entre em contato através do WhatsApp. 
              Estamos aqui para ajudar você a aproveitar ao máximo o sistema!
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}