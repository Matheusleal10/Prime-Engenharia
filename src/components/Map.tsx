
import React, { useEffect, useRef, useState } from 'react';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    let map: any = null;

    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers
        const DefaultIcon = L.Icon.Default;
        delete (DefaultIcon.prototype as any)._getIconUrl;
        DefaultIcon.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Coordinates for Estrada da Raposa, 2002 - Raposa - MA
        const position: [number, number] = [-2.4252, -44.0934];

        // Initialize map
        map = L.map(mapRef.current!).setView(position, 15);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker with popup
        L.marker(position)
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; font-family: inherit;">
              <strong>PRIME ENGENHARIA</strong><br/>
              Estrada da Raposa, 2002<br/>
              Raposa - MA, 65138-000<br/>
              Brasil
            </div>
          `);

        // Disable scroll wheel zoom for better UX
        map.scrollWheelZoom.disable();

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex flex-col items-center justify-center text-center p-4">
        <div className="text-gray-600 mb-2">📍</div>
        <div className="text-sm text-gray-600">
          <strong>PRIME ENGENHARIA</strong><br/>
          Estrada da Raposa, 2002<br/>
          Raposa - MA, 65138-000<br/>
          Brasil
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
