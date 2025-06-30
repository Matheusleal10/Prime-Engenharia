
import React from 'react';

interface MapboxErrorProps {
  onResetApiKey: () => void;
}

const MapboxError = ({ onResetApiKey }: MapboxErrorProps) => {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center text-center p-6">
      <div className="text-red-500 text-3xl mb-3">🚫</div>
      <div className="text-sm text-gray-700 mb-4 max-w-sm">
        <strong className="text-red-600">Erro ao carregar o mapa</strong><br/>
        Verifique se sua API Key do Mapbox está correta e ativa
      </div>
      <button
        onClick={onResetApiKey}
        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 px-6 rounded-lg text-sm font-medium mb-4 transition-all transform hover:scale-105"
      >
        🔧 Configurar Nova API Key
      </button>
      <div className="mt-2 text-xs text-gray-600 bg-white/50 p-3 rounded-lg">
        <strong className="text-green-600">🏭 PRIME ENGENHARIA</strong><br/>
        MA 203 - Estr. da Raposa, 79<br/>
        Alto do Farol, Raposa - MA<br/>
        📞 (98) 99999-9999
      </div>
    </div>
  );
};

export default MapboxError;
