
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificar se já existe uma API key salva no localStorage
    const savedApiKey = localStorage.getItem('google-maps-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiInput(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || !apiKey) return;

    let map: google.maps.Map | null = null;

    const initializeGoogleMap = async () => {
      setIsLoading(true);
      setMapError(false);
      
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        // Coordenadas para Estrada da Raposa, 2002 - Raposa - MA
        const position = { lat: -2.4252, lng: -44.0934 };

        // Inicializar Google Map com vista híbrida (satélite realístico + ruas)
        map = new google.maps.Map(mapRef.current!, {
          zoom: 16,
          center: position,
          mapTypeId: google.maps.MapTypeId.HYBRID, // Vista satélite realística
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          scrollwheel: false, // Desabilitar zoom com scroll para melhor UX
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        // Criar marcador personalizado com informações da empresa
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'PRIME ENGENHARIA',
          animation: google.maps.Animation.DROP
        });

        // Criar janela de informações com detalhes da empresa
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="text-align: center; font-family: 'Montserrat', sans-serif; padding: 10px; max-width: 250px;">
              <h3 style="color: #4A7C59; font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">
                PRIME ENGENHARIA
              </h3>
              <p style="margin: 4px 0; color: #374151; font-size: 14px;">
                <strong>📍 Endereço:</strong><br/>
                Estrada da Raposa, 2002<br/>
                Raposa - MA, 65138-000<br/>
                Brasil
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6B7280;">
                <strong>📞 Contato:</strong> (98) 99999-9999
              </p>
            </div>
          `
        });

        // Abrir janela de informações quando o marcador for clicado
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Auto-abrir janela de informações no carregamento
        infoWindow.open(map, marker);

        console.log('Google Map inicializado com sucesso');
        
        // Salvar API key válida no localStorage
        localStorage.setItem('google-maps-api-key', apiKey);

      } catch (error) {
        console.error('Erro ao inicializar Google Map:', error);
        setMapError(true);
        // Remover API key inválida do localStorage
        localStorage.removeItem('google-maps-api-key');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogleMap();

    // Cleanup
    return () => {
      if (map) {
        map = null;
      }
    };
  }, [isClient, apiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowApiInput(false);
    }
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('google-maps-api-key');
    setApiKey('');
    setShowApiInput(true);
    setMapError(false);
  };

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  if (!apiKey || showApiInput) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🗺️</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Google Maps Realístico</h3>
          <p className="text-sm text-gray-600 mb-4">
            Para exibir o mapa com imagens de satélite reais, insira sua chave da API do Google Maps
          </p>
        </div>
        
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md">
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
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <div className="text-gray-500 text-sm">Carregando mapa realístico...</div>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-500 text-2xl mb-2">⚠️</div>
        <div className="text-sm text-gray-600 mb-4">
          <strong>Erro ao carregar o mapa</strong><br/>
          Verifique se sua API Key está correta e se a Maps JavaScript API está ativada
        </div>
        <button
          onClick={handleResetApiKey}
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
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg relative">
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={handleResetApiKey}
        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 p-1 rounded text-xs shadow-md transition-all"
        title="Alterar API Key"
      >
        ⚙️
      </button>
    </div>
  );
};

export default Map;
