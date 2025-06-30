
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const useMapbox = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificar se existe uma API key salva
    const savedKey = localStorage.getItem('mapbox-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiInput(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !apiKey || !mapRef.current) return;

    let map: mapboxgl.Map | null = null;
    
    const initializeMapbox = async () => {
      setIsLoading(true);
      setMapError(false);
      
      try {
        console.log('Inicializando Mapbox...');

        // Configurar token de acesso
        mapboxgl.accessToken = apiKey;

        // Coordenadas para PRIME ENGENHARIA - Raposa, MA
        const position: [number, number] = [-44.0856, -2.4205];

        // Criar mapa com estilo satellite
        map = new mapboxgl.Map({
          container: mapRef.current!,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          projection: 'globe',
          zoom: 16,
          center: position,
          pitch: 45,
          bearing: 0,
          antialias: true
        });

        // Adicionar controles de navegação
        map.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true
          }),
          'top-right'
        );

        // Adicionar controle de tela cheia
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        // Configurar atmosfera e efeitos quando o mapa carregar
        map.on('style.load', () => {
          // Adicionar efeitos atmosféricos
          map!.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });

          console.log('Mapa carregado, adicionando marcador...');
        });

        // Criar marcador customizado com popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="text-align: center; font-family: 'Montserrat', sans-serif; padding: 15px; min-width: 280px;">
            <h3 style="color: #4A7C59; font-weight: bold; margin: 0 0 12px 0; font-size: 18px;">
              🏭 PRIME ENGENHARIA
            </h3>
            <p style="margin: 8px 0; color: #374151; font-size: 14px; line-height: 1.5;">
              <strong>📍 Endereço:</strong><br/>
              MA 203 - Estr. da Raposa, 79<br/>
              Alto do Farol, Raposa - MA<br/>
              65138-000, Brasil
            </p>
            <p style="margin: 12px 0 8px 0; font-size: 13px; color: #6B7280;">
              <strong>📞 Contato:</strong> (98) 99999-9999<br/>
              <strong>⏰ Horário:</strong> Seg-Sex: 7h às 17h
            </p>
            <a href="https://wa.me/5598999999999" target="_blank" 
               style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; 
                      border-radius: 25px; text-decoration: none; font-weight: bold; margin-top: 10px;">
              💬 WhatsApp
            </a>
          </div>
        `);

        // Adicionar marcador na localização
        const marker = new mapboxgl.Marker({
          color: '#4A7C59',
          scale: 1.2
        })
          .setLngLat(position)
          .setPopup(popup)
          .addTo(map);

        // Abrir popup automaticamente
        popup.addTo(map);

        console.log('Mapbox inicializado com sucesso');
        localStorage.setItem('mapbox-api-key', apiKey);

      } catch (error) {
        console.error('Erro ao inicializar Mapbox:', error);
        setMapError(true);
        localStorage.removeItem('mapbox-api-key');
      } finally {
        setIsLoading(false);
      }
    };

    // Aguardar um pouco para garantir que o DOM está pronto
    const timeoutId = setTimeout(initializeMapbox, 100);

    return () => {
      clearTimeout(timeoutId);
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [isClient, apiKey]);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiInput(false);
    setMapError(false);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('mapbox-api-key');
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
