
import React, { useState } from 'react';

interface MapboxApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const MapboxApiKeyInput = ({ onApiKeySubmit }: MapboxApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🌍</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Mapbox Professional</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">
          Para exibir o mapa profissional com imagens de satélite em alta resolução e efeitos 3D, 
          insira sua chave da API do Mapbox (gratuita até 50.000 visualizações/mês)
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          placeholder="Cole aqui sua Mapbox API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02]"
        >
          🚀 Carregar Mapa Profissional
        </button>
      </form>
      
      <div className="mt-6 text-xs text-gray-500 text-center max-w-md">
        <p className="mb-3"><strong>🎯 Como obter sua chave gratuita:</strong></p>
        <ol className="text-left space-y-1 mb-4">
          <li>1. Acesse <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">mapbox.com</a></li>
          <li>2. Crie uma conta gratuita</li>
          <li>3. Vá para o dashboard e copie seu "Public Token"</li>
          <li>4. Cole aqui e aproveite o mapa profissional!</li>
        </ol>
        <div className="text-green-600 font-medium">
          ✨ Recursos: Globo 3D, Satélite HD, Efeitos atmosféricos
        </div>
      </div>
    </div>
  );
};

export default MapboxApiKeyInput;
