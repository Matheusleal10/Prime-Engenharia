import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertTriangle } from 'lucide-react';

interface InventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
}

export const InventoryFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter
}: InventoryFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="estruturas-metalicas">Estruturas Metálicas</SelectItem>
            <SelectItem value="blocos-tijolos">Blocos e Tijolos</SelectItem>
            <SelectItem value="soldas-eletrodos">Soldas e Eletrodos</SelectItem>
            <SelectItem value="parafusos-fixacao">Parafusos e Fixação</SelectItem>
            <SelectItem value="tintas-acabamentos">Tintas e Acabamentos</SelectItem>
            <SelectItem value="ferramentas-manuais">Ferramentas Manuais</SelectItem>
            <SelectItem value="ferramentas-eletricas">Ferramentas Elétricas</SelectItem>
            <SelectItem value="materiais-construcao">Materiais de Construção</SelectItem>
            <SelectItem value="equipamentos-seguranca">Equipamentos de Segurança</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[150px]">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="low">Estoque Baixo</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Estoque Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};