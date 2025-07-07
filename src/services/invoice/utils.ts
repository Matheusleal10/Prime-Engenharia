export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'issued': return 'Emitida';
    case 'sent': return 'Enviada';
    case 'paid': return 'Paga';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};