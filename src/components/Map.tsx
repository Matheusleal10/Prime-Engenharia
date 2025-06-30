
import React from 'react';
import { useMapbox } from '../hooks/useMapbox';
import MapboxApiKeyInput from './MapboxApiKeyInput';
import MapboxError from './MapboxError';
import MapboxLoading from './MapboxLoading';

const Map = () => {
  const {
    mapRef,
    isClient,
    mapError,
    apiKey,
    showApiInput,
    isLoading,
    handleApiKeySubmit,
    handleResetApiKey
  } = useMapbox();

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  if (!apiKey || showApiInput) {
    return <MapboxApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  if (isLoading) {
    return <MapboxLoading />;
  }

  if (mapError) {
    return <MapboxError onResetApiKey={handleResetApiKey} />;
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg relative">
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={handleResetApiKey}
        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg text-sm shadow-lg transition-all transform hover:scale-105 backdrop-blur-sm"
        title="Alterar API Key do Mapbox"
      >
        ⚙️
      </button>
      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-500/90 to-green-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
        🌍 Mapbox Professional
      </div>
    </div>
  );
};

export default Map;
