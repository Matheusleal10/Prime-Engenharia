
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const useGoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Try to get API key from environment variable first
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Fallback to localStorage if env var is not available
    const storedApiKey = localStorage.getItem('google-maps-api-key');
    
    if (envApiKey) {
      console.log('Using Google Maps API key from environment variables');
      setApiKey(envApiKey);
      setShowApiInput(false);
    } else if (storedApiKey) {
      console.log('Using Google Maps API key from localStorage');
      setApiKey(storedApiKey);
      setShowApiInput(false);
    } else {
      console.log('No Google Maps API key found, showing input form');
      setShowApiInput(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !apiKey) return;

    let map: google.maps.Map | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const waitForElement = (selector: HTMLElement | null, maxWait = 5000): Promise<HTMLElement> => {
      return new Promise((resolve, reject) => {
        if (selector) {
          resolve(selector);
          return;
        }

        const startTime = Date.now();
        const checkElement = () => {
          if (mapRef.current) {
            console.log('Elemento do mapa encontrado após aguardar');
            resolve(mapRef.current);
          } else if (Date.now() - startTime > maxWait) {
            reject(new Error('Timeout: elemento do mapa não encontrado'));
          } else {
            setTimeout(checkElement, 100);
          }
        };
        checkElement();
      });
    };

    const initializeGoogleMap = async () => {
      setIsLoading(true);
      setMapError(false);
      
      try {
        console.log(`Tentativa ${retryCount + 1} de inicialização do Google Maps`);
        
        // Aguardar elemento DOM estar disponível
        const mapElement = await waitForElement(mapRef.current);
        console.log('Elemento do mapa confirmado:', mapElement);

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'marker']
        });

        const google = await loader.load();
        console.log('Google Maps API carregada com sucesso');

        // Coordenadas para MA 203 - Estr. da Raposa, 79 - Alto do Farol, Raposa - MA
        const position = { lat: -2.4205, lng: -44.0856 };

        map = new google.maps.Map(mapElement, {
          zoom: 16,
          center: position,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          scrollwheel: false,
          mapId: 'DEMO_MAP_ID', // Necessário para AdvancedMarkerElement
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        console.log('Mapa criado, criando marcador...');

        // Usar a nova AdvancedMarkerElement em vez do Marker depreciado
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
        
        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          title: 'PRIME ENGENHARIA'
        });

        console.log('Marcador criado com sucesso');

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="text-align: center; font-family: 'Montserrat', sans-serif; padding: 10px; max-width: 250px;">
              <h3 style="color: #4A7C59; font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">
                PRIME ENGENHARIA
              </h3>
              <p style="margin: 4px 0; color: #374151; font-size: 14px;">
                <strong>📍 Endereço:</strong><br/>
                MA 203 - Estr. da Raposa, 79<br/>
                Alto do Farol, Raposa - MA<br/>
                65138-000, Brasil
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6B7280;">
                <strong>📞 Contato:</strong> (98) 99999-9999
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Abrir InfoWindow automaticamente
        infoWindow.open(map, marker);

        console.log('Google Map inicializado com sucesso');
        localStorage.setItem('google-maps-api-key', apiKey);

      } catch (error) {
        console.error(`Erro na tentativa ${retryCount + 1}:`, error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Tentando novamente em 2 segundos... (${retryCount}/${maxRetries})`);
          setTimeout(initializeGoogleMap, 2000);
          return;
        }
        
        console.error('Erro final ao inicializar Google Map:', error);
        setMapError(true);
        localStorage.removeItem('google-maps-api-key');
      } finally {
        setIsLoading(false);
      }
    };

    // Aguardar um pouco antes de inicializar para garantir que o DOM está pronto
    const timeoutId = setTimeout(initializeGoogleMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (map) {
        map = null;
      }
    };
  }, [isClient, apiKey]);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiInput(false);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('google-maps-api-key');
    setApiKey('');
    setShowApiInput(true);
    setMapError(false);
  };

  return {
    mapRef,
    isClient,
    mapError,
    apiKey,
    showApiInput,
    isLoading,
    handleApiKeySubmit,
    handleResetApiKey
  };
};
