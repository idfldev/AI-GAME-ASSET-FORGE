
import React, { forwardRef } from 'react';
import { MapShape } from '../types';

interface MapPreviewProps {
  artUrl: string;
  shape: MapShape;
}

export const MapPreview = forwardRef<HTMLDivElement, MapPreviewProps>(({ artUrl, shape }, ref) => {
  const hexagonStyle = {
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  };

  return (
    <div
      ref={ref}
      className="w-full max-w-sm aspect-square flex items-center justify-center"
    >
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-300"
        style={{ 
            ...(shape === MapShape.HEXAGON ? hexagonStyle : {}),
            backgroundImage: artUrl ? `url(${artUrl})` : 'none',
            borderRadius: shape === MapShape.SQUARE ? '0.75rem' : '0'
        }}
      >
        {!artUrl && (
          <div className={`w-full h-full flex items-center justify-center bg-gray-700 text-gray-500 ${shape === MapShape.SQUARE ? 'rounded-lg' : ''}`}>
             Tile Preview
          </div>
        )}
      </div>
    </div>
  );
});
