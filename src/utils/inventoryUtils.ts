export const getStockStatus = (current: number, min: number, max: number) => {
  if (current <= min) return { status: 'low', label: 'Baixo', variant: 'destructive' as const };
  if (current >= max) return { status: 'high', label: 'Alto', variant: 'secondary' as const };
  return { status: 'normal', label: 'Normal', variant: 'default' as const };
};

export const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    'estruturas-metalicas': 'Estruturas Metálicas',
    'blocos-tijolos': 'Blocos e Tijolos',
    'soldas-eletrodos': 'Soldas e Eletrodos',
    'parafusos-fixacao': 'Parafusos e Fixação',
    'tintas-acabamentos': 'Tintas e Acabamentos',
    'ferramentas-manuais': 'Ferramentas Manuais',
    'ferramentas-eletricas': 'Ferramentas Elétricas',
    'materiais-construcao': 'Materiais de Construção',
    'equipamentos-seguranca': 'Equipamentos de Segurança',
    'outros': 'Outros'
  };
  return labels[category] || category;
};

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};