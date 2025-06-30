
import React from 'react';

const MapboxLoading = () => {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🌍</div>
        </div>
        <div className="text-gray-600 text-sm font-medium mb-1">Carregando Mapbox Professional</div>
        <div className="text-gray-500 text-xs">Globo 3D • Satélite HD • Efeitos atmosféricos</div>
      </div>
    </div>
  );
};

export default MapboxLoading;
