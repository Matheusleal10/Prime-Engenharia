
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || !apiKey) return;

    let map: google.maps.Map | null = null;

    const initializeGoogleMap = async () => {
      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();

        // Coordinates for Estrada da Raposa, 2002 - Raposa - MA
        const position = { lat: -2.4252, lng: -44.0934 };

        // Initialize Google Map with hybrid view (realistic satellite + roads)
        map = new google.maps.Map(mapRef.current!, {
          zoom: 16,
          center: position,
          mapTypeId: google.maps.MapTypeId.HYBRID, // Realistic satellite view
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          scrollwheel: false, // Disable scroll wheel zoom for better UX
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        // Create custom marker with company info
        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'PRIME ENGENHARIA',
          animation: google.maps.Animation.DROP
        });

        // Create info window with company details
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

        // Open info window when marker is clicked
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Auto-open info window on load
        infoWindow.open(map, marker);

        console.log('Google Map inicializado com sucesso');

      } catch (error) {
        console.error('Erro ao inicializar Google Map:', error);
        setMapError(true);
      }
    };

    initializeGoogleMap();

    // Cleanup
    return () => {
      if (map) {
        // Google Maps cleanup is handled automatically
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
          <h3 className="text-lg font-bold text-gray-700 mb-2">Google Maps</h3>
          <p className="text-sm text-gray-600 mb-4">
            Para exibir o mapa realístico, insira sua chave da API do Google Maps
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
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Carregar Mapa
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Para obter sua chave gratuita:</p>
          <a 
            href="https://console.cloud.google.com/google/maps-apis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Google Cloud Console → Maps API
          </a>
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
          Verifique se sua API Key está correta
        </div>
        <button
          onClick={() => setShowApiInput(true)}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm"
        >
          Tentar Novamente
        </button>
        <div className="mt-4 text-xs text-gray-600">
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
        onClick={() => setShowApiInput(true)}
        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 p-1 rounded text-xs shadow-md transition-all"
        title="Alterar API Key"
      >
        ⚙️
      </button>
    </div>
  );
};

export default Map;
