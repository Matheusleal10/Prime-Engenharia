import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Plus, TrendingUp, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  loyalty_points: number;
}

interface LoyaltyTransaction {
  id: string;
  customer_id: string;
  transaction_type: string;
  points: number;
  description: string;
  created_at: string;
  customers: {
    name: string;
  };
}

interface LoyaltyStats {
  totalCustomers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  averagePoints: number;
}

export function LoyaltyManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [stats, setStats] = useState<LoyaltyStats>({
    totalCustomers: 0,
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
    averagePoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar clientes com pontos
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name, email, loyalty_points')
        .order('loyalty_points', { ascending: false });

      if (customersError) throw customersError;

      // Buscar transações recentes
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_transactions')
        .select(`
          *,
          customers:customer_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      setCustomers(customersData || []);
      setTransactions(transactionsData || []);
      calculateStats(customersData || [], transactionsData || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de loyalty.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (customersData: Customer[], transactionsData: LoyaltyTransaction[]) => {
    const totalCustomers = customersData.length;
    const totalPointsIssued = transactionsData
      .filter(t => t.transaction_type === 'earned' || t.transaction_type === 'bonus')
      .reduce((sum, t) => sum + t.points, 0);
    const totalPointsRedeemed = transactionsData
      .filter(t => t.transaction_type === 'redeemed')
      .reduce((sum, t) => sum + t.points, 0);
    const averagePoints = totalCustomers > 0 
      ? customersData.reduce((sum, c) => sum + (c.loyalty_points || 0), 0) / totalCustomers 
      : 0;

    setStats({
      totalCustomers,
      totalPointsIssued,
      totalPointsRedeemed,
      averagePoints
    });
  };

  const addTransaction = async () => {
    if (!selectedCustomer || !transactionType || !points) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('loyalty_transactions')
        .insert({
          customer_id: selectedCustomer,
          transaction_type: transactionType,
          points: parseInt(points),
          description: description || null
        });

      if (error) throw error;

      toast({
        title: "Transação criada",
        description: "Transação de pontos criada com sucesso.",
      });

      // Reset form
      setSelectedCustomer('');
      setTransactionType('');
      setPoints('');
      setDescription('');
      setDialogOpen(false);
      
      fetchData();
    } catch (error) {
      toast({
        title: "Erro ao criar transação",
        description: "Não foi possível criar a transação.",
        variant: "destructive"
      });
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'earned': return 'Ganhou';
      case 'redeemed': return 'Resgatou';
      case 'expired': return 'Expirou';
      case 'bonus': return 'Bônus';
      default: return type;
    }
  };

  const getTransactionVariant = (type: string) => {
    switch (type) {
      case 'earned': return 'default';
      case 'redeemed': return 'secondary';
      case 'expired': return 'destructive';
      case 'bonus': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pontos Emitidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPointsIssued}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pontos Resgatados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPointsRedeemed}</p>
              </div>
              <Gift className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média de Pontos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averagePoints.toFixed(0)}</p>
              </div>
              <Star className="h-4 w-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes por Pontos</CardTitle>
            <CardDescription>
              Clientes com mais pontos de fidelidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Pontos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.slice(0, 10).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {customer.loyalty_points || 0} pts
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas movimentações de pontos
            </CardDescription>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Transação de Pontos</DialogTitle>
                  <DialogDescription>
                    Adicione ou remova pontos de um cliente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Cliente</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.loyalty_points || 0} pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo de Transação</Label>
                    <Select value={transactionType} onValueChange={setTransactionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earned">Pontos Ganhos</SelectItem>
                        <SelectItem value="bonus">Bônus</SelectItem>
                        <SelectItem value="redeemed">Resgate</SelectItem>
                        <SelectItem value="expired">Expiração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="points">Pontos</Label>
                    <Input
                      id="points"
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      placeholder="Quantidade de pontos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Motivo da transação..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addTransaction}>Criar Transação</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.customers?.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTransactionVariant(transaction.transaction_type)}>
                          {getTransactionTypeLabel(transaction.transaction_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={transaction.transaction_type === 'redeemed' || transaction.transaction_type === 'expired' ? 'text-red-600' : 'text-green-600'}>
                          {transaction.transaction_type === 'redeemed' || transaction.transaction_type === 'expired' ? '-' : '+'}
                          {transaction.points}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}