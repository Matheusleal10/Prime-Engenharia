
import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">🗺️</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Google Maps Realístico</h3>
        <p className="text-sm text-gray-600 mb-4">
          Para exibir o mapa com imagens de satélite reais, insira sua chave da API do Google Maps
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          placeholder="Cole aqui sua Google Maps API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Carregar Mapa Realístico
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p className="mb-2"><strong>📋 Como obter sua chave gratuita:</strong></p>
        <ol className="text-left space-y-1 mb-3">
          <li>1. Acesse o <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></li>
          <li>2. Crie um novo projeto ou selecione um existente</li>
          <li>3. Ative a <strong>Maps JavaScript API</strong></li>
          <li>4. Vá em "Credenciais" e crie uma nova API Key</li>
          <li>5. Configure as restrições para seu domínio</li>
        </ol>
        <a 
          href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-xs"
        >
          📖 Guia completo da documentação
        </a>
      </div>
    </div>
  );
};

export default ApiKeyInput;
