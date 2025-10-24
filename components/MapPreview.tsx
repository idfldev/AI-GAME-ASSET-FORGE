import React, { forwardRef } from 'react';
import { MapData } from '../types';

interface MapPreviewProps {
  data: MapData;
}

export const MapPreview = forwardRef<HTMLDivElement, MapPreviewProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="w-full max-w-2xl aspect-video rounded-xl shadow-2xl bg-gray-800 border-4 border-gray-600 overflow-hidden">
      {data.mapUrl ? (
        <img src={data.mapUrl} alt="Generated Map" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Map Preview
        </div>
      )}
    </div>
  );
});
