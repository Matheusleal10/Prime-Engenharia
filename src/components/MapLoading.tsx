
import React from 'react';

const MapLoading = () => {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
        <div className="text-gray-500 text-sm">Carregando mapa realístico...</div>
      </div>
    </div>
  );
};

export default MapLoading;
