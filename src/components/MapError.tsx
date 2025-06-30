
import React from 'react';

interface MapErrorProps {
  onResetApiKey: () => void;
}

const MapError = ({ onResetApiKey }: MapErrorProps) => {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <div className="text-red-500 text-2xl mb-2">⚠️</div>
      <div className="text-sm text-gray-600 mb-4">
        <strong>Erro ao carregar o mapa</strong><br/>
        Verifique se sua API Key está correta e se a Maps JavaScript API está ativada
      </div>
      <button
        onClick={onResetApiKey}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm mb-4"
      >
        Configurar Nova API Key
      </button>
      <div className="mt-2 text-xs text-gray-600">
        <strong>PRIME ENGENHARIA</strong><br/>
        Estrada da Raposa, 2002<br/>
        Raposa - MA, 65138-000
      </div>
    </div>
  );
};

export default MapError;
