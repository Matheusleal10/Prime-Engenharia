
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

        const position = { lat: -2.4252, lng: -44.0934 };

        map = new google.maps.Map(mapRef.current!, {
          zoom: 16,
          center: position,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          scrollwheel: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        const marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'PRIME ENGENHARIA',
          animation: google.maps.Animation.DROP
        });

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

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        infoWindow.open(map, marker);

        console.log('Google Map inicializado com sucesso');
        localStorage.setItem('google-maps-api-key', apiKey);

      } catch (error) {
        console.error('Erro ao inicializar Google Map:', error);
        setMapError(true);
        localStorage.removeItem('google-maps-api-key');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogleMap();

    return () => {
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
