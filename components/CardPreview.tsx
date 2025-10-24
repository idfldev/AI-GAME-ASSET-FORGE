import React, { forwardRef } from 'react';
import { CardData, CardType, CardFrame, CardFont, CardSize, CardFormat } from '../types';

interface CardPreviewProps {
  data: CardData;
}

const frameColors: Record<CardType, { bg: string, border: string, name: string }> = {
  [CardType.ATTACK]: { bg: 'bg-red-900', border: 'border-red-500', name: 'bg-red-950' },
  [CardType.SKILL]: { bg: 'bg-blue-900', border: 'border-blue-500', name: 'bg-blue-950' },
  [CardType.RESOURCE]: { bg: 'bg-green-900', border: 'border-green-500', name: 'bg-green-950' },
  [CardType.CREATURE]: { bg: 'bg-yellow-900', border: 'border-yellow-600', name: 'bg-yellow-950' },
  [CardType.EVENT]: { bg: 'bg-purple-900', border: 'border-purple-500', name: 'bg-purple-950' },
  [CardType.LOCATION]: { bg: 'bg-gray-800', border: 'border-gray-500', name: 'bg-gray-900' },
  [CardType.EQUIPMENT]: { bg: 'bg-slate-800', border: 'border-slate-500', name: 'bg-slate-900' },
  [CardType.CLUE]: { bg: 'bg-teal-900', border: 'border-teal-500', name: 'bg-teal-950' },
  [CardType.CHARACTER]: { bg: 'bg-sky-900', border: 'border-sky-500', name: 'bg-sky-950' },
  [CardType.TRAP]: { bg: 'bg-indigo-900', border: 'border-indigo-500', name: 'bg-indigo-950' },
  [CardType.ITEM]: { bg: 'bg-amber-900', border: 'border-amber-600', name: 'bg-amber-950' },
};

const fontClassMap: Record<CardFont, string> = {
  [CardFont.FANTASY]: 'font-fantasy',
  [CardFont.SCIFI]: 'font-scifi',
  [CardFont.MEDIEVAL]: 'font-medieval',
  [CardFont.HORROR]: 'font-horror',
  [CardFont.MODERN]: 'font-modern',
  [CardFont.COMIC]: 'font-comic',
  [CardFont.CHILDLIKE]: 'font-childlike',
  [CardFont.SCRIPT]: 'font-script',
  [CardFont.TYPING]: 'font-typing',
};


const PortraitCardContent = ({ data, theme, fontClass }: { data: CardData, theme: any, fontClass: string }) => (
  <>
    <div className={`${theme.nameBg} rounded-md p-1.5 text-center`}>
      <h2 className={`text-lg font-bold tracking-wide ${theme.textColor} ${fontClass}`}>{data.name || 'Card Name'}</h2>
    </div>
    
    <div className={`my-2 flex-shrink-0 h-3/5 border-2 ${theme.artBorder} rounded-lg overflow-hidden`}>
      {data.artUrl ? (
        <img src={data.artUrl} alt="Generated Card Art" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full ${theme.artBg} flex items-center justify-center ${theme.artPlaceholderColor}`}>
          Art Preview
        </div>
      )}
    </div>

    <div className={`${theme.descBg} rounded-md p-2 flex-grow flex flex-col justify-between text-xs md:text-sm ${fontClass}`}>
      <p className={`leading-snug ${theme.textColor}`}>{data.description || 'Card description goes here.'}</p>
      <p className={`${theme.flavorColor} italic mt-2 text-xs border-t ${theme.flavorBorder} pt-1`}>
        {data.flavorText || 'Flavor text adds to the lore.'}
      </p>
    </div>
  </>
);

const HorizontalCardContent = ({ data, theme, fontClass }: { data: CardData, theme: any, fontClass: string }) => (
    <div className="flex h-full gap-2">
        <div className={`w-1/2 h-full border-2 ${theme.artBorder} rounded-lg overflow-hidden`}>
            {data.artUrl ? (
                <img src={data.artUrl} alt="Generated Card Art" className="w-full h-full object-cover" />
            ) : (
                <div className={`w-full h-full ${theme.artBg} flex items-center justify-center ${theme.artPlaceholderColor}`}>
                    Art
                </div>
            )}
        </div>
        
        <div className="w-1/2 flex flex-col gap-2">
            <div className={`${theme.nameBg} rounded-md p-1.5 text-center`}>
                <h2 className={`text-base font-bold tracking-wide ${theme.textColor} ${fontClass}`}>{data.name || 'Card Name'}</h2>
            </div>
            <div className={`${theme.descBg} rounded-md p-2 flex-grow flex flex-col justify-between text-xs ${fontClass}`}>
                <p className={`leading-snug ${theme.textColor}`}>{data.description || 'Card description goes here.'}</p>
                <p className={`${theme.flavorColor} italic mt-1 text-xs border-t ${theme.flavorBorder} pt-1`}>
                    {data.flavorText || 'Flavor text.'}
                </p>
            </div>
        </div>
    </div>
);


export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ data }, ref) => {
  const { cardType, cardFont, cardFrame, cardSize, cardFormat } = data;
  
  const colors = frameColors[cardType] || frameColors[CardType.SKILL];
  const fontClass = fontClassMap[cardFont] || fontClassMap[CardFont.FANTASY];

  const isLightTheme = cardFrame === CardFrame.PARCHMENT;
  const theme = {
      nameBg: isLightTheme ? 'bg-stone-300/60' : colors.name,
      descBg: isLightTheme ? 'bg-stone-200/60' : 'bg-gray-800',
      textColor: isLightTheme ? 'text-stone-800' : 'text-white',
      flavorColor: isLightTheme ? 'text-stone-600' : 'text-gray-400',
      flavorBorder: isLightTheme ? 'border-stone-400' : 'border-gray-600',
      artBorder: isLightTheme ? 'border-stone-400' : 'border-gray-600',
      artBg: isLightTheme ? 'bg-stone-300' : 'bg-gray-700',
      artPlaceholderColor: isLightTheme ? 'text-stone-500' : 'text-gray-500'
  };
  
  let aspectClass;
    if (cardFormat === CardFormat.HORIZONTAL) {
        aspectClass = cardSize === CardSize.SQUARE ? 'aspect-square' : 'aspect-[3.5/2.5]';
    } else {
        if (cardSize === CardSize.SQUARE) aspectClass = 'aspect-square';
        else if (cardSize === CardSize.TAROT) aspectClass = 'aspect-[70/120]';
        else aspectClass = 'aspect-[2.5/3.5]';
    }

  const baseContainerClasses = `w-full ${cardFormat === CardFormat.HORIZONTAL ? 'max-w-md' : 'max-w-sm'} ${aspectClass} rounded-xl shadow-2xl relative transform transition-transform hover:scale-105`;

  const CardContentComponent = cardFormat === CardFormat.HORIZONTAL ? HorizontalCardContent : PortraitCardContent;


  // Gradient frames use a different structure
  if (cardFrame === CardFrame.ORNATE || cardFrame === CardFrame.EGYPTIAN) {
      const gradient = cardFrame === CardFrame.ORNATE 
          ? 'from-yellow-300 via-amber-500 to-orange-600'
          : 'from-yellow-500 via-yellow-400 to-amber-500';
    return (
      <div ref={ref} className={`${baseContainerClasses} p-1.5 bg-gradient-to-br ${gradient}`}>
        <div className={`w-full h-full rounded-lg overflow-hidden p-1.5 ${cardFormat === CardFormat.PORTRAIT ? 'flex flex-col' : ''} ${colors.bg} bg-opacity-95`}>
          <CardContentComponent data={data} theme={theme} fontClass={fontClass} />
        </div>
      </div>
    );
  }

  // Handle other frames
  let frameSpecificClasses = '';
  switch (cardFrame) {
    case CardFrame.CLASSIC:
      frameSpecificClasses = `p-2.5 ${colors.bg} ${colors.border} border-4`;
      break;
    case CardFrame.MINIMALIST:
      frameSpecificClasses = `p-2.5 ${colors.bg} ${colors.border} border-2`;
      break;
    case CardFrame.INDUSTRIAL:
      frameSpecificClasses = `p-2 bg-slate-800 border-8 border-double border-slate-500`;
      break;
    case CardFrame.RUSTIC:
      frameSpecificClasses = `p-2 bg-amber-900 border-8 border-amber-800`;
      break;
    case CardFrame.CARTOON:
      frameSpecificClasses = `p-2 ${colors.bg} border-8 border-black`;
      break;
    case CardFrame.PARCHMENT:
      frameSpecificClasses = `p-2.5 bg-[#f5eecf] border-4 border-[#d3c4a3]`;
      break;
    case CardFrame.GLASS:
      frameSpecificClasses = `p-2.5 bg-slate-500/30 backdrop-blur-md border-2 border-slate-300/50`;
      break;
    default:
        frameSpecificClasses = `p-2.5 ${colors.bg} ${colors.border} border-4`;
        break;
  }
  
  const finalContainerClasses = `${baseContainerClasses} overflow-hidden ${cardFormat === CardFormat.PORTRAIT ? 'flex flex-col' : ''} ${frameSpecificClasses}`;

  return (
    <div ref={ref} className={finalContainerClasses}>
      <CardContentComponent data={data} theme={theme} fontClass={fontClass} />
    </div>
  );
});