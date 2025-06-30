
import React from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import ApiKeyInput from './ApiKeyInput';
import MapError from './MapError';
import MapLoading from './MapLoading';

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
  } = useGoogleMaps();

  if (!isClient) {
    return (
      <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Carregando mapa...</div>
      </div>
    );
  }

  if (!apiKey || showApiInput) {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  if (isLoading) {
    return <MapLoading />;
  }

  if (mapError) {
    return <MapError onResetApiKey={handleResetApiKey} />;
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
