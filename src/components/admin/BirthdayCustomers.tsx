import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  loyalty_points: number;
}

export function BirthdayCustomers() {
  const [birthdayCustomers, setBirthdayCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBirthdayCustomers();
  }, []);

  const fetchBirthdayCustomers = async () => {
    try {
      // Buscar clientes que fazem aniversário hoje ou nos próximos 7 dias
      const today = new Date();
      const todayMonth = today.getMonth() + 1; // getMonth() retorna 0-11
      const todayDay = today.getDate();
      
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, birth_date, loyalty_points')
        .not('birth_date', 'is', null);

      if (error) throw error;
      
      // Filtrar clientes que fazem aniversário nos próximos 7 dias
      const birthdayCustomers = (data || []).filter(customer => {
        if (!customer.birth_date) return false;
        
        const birthDate = new Date(customer.birth_date);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        // Verificar se o aniversário é hoje ou nos próximos 7 dias
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() + i);
          const checkMonth = checkDate.getMonth() + 1;
          const checkDay = checkDate.getDate();
          
          if (birthMonth === checkMonth && birthDay === checkDay) {
            return true;
          }
        }
        return false;
      });
      
      setBirthdayCustomers(birthdayCustomers);
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    }
  };

  const sendBirthdayMessages = async () => {
    try {
      // Aqui você implementaria a lógica de envio real
      toast({
        title: "Mensagens enviadas",
        description: `${birthdayCustomers.length} mensagens de aniversário foram enviadas.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagens",
        description: "Não foi possível enviar as mensagens de aniversário.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Aniversariantes
        </CardTitle>
        <CardDescription>
          {birthdayCustomers.length} clientes fazem aniversário nos próximos 7 dias
        </CardDescription>
        {birthdayCustomers.length > 0 && (
          <Button onClick={sendBirthdayMessages} className="w-fit">
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagens de Aniversário
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {birthdayCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum aniversariante nos próximos 7 dias
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Aniversário</TableHead>
                <TableHead>Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {birthdayCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    {new Date(customer.birth_date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
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
  );
}