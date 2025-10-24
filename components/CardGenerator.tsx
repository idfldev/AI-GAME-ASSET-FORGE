import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CardPreview } from './CardPreview';
import { generateCardContent } from '../services/geminiService';
import { CardData, CardType, CardFont, CardFrame, CardSize, CardFormat, ArtStyle } from '../types';
import { Loader } from './common/Loader';
import { Download, Sparkles, Undo, Redo } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useHistoryState } from '../hooks/useHistoryState';

interface CardGenerationState {
    config: {
        artPrompt: string;
        textPrompt: string;
        cardType: CardType;
        cardFont: CardFont;
        cardFrame: CardFrame;
        cardSize: CardSize;
        cardFormat: CardFormat;
        artStyle: ArtStyle;
        artKeywords: string;
    };
    result: {
        generatedImages: string[];
        selectedImage: string;
        generatedText: { name: string; description: string; flavorText: string; };
    } | null;
}

const initialCardState: CardGenerationState = {
    config: {
        artPrompt: 'A majestic dragon warrior, wielding a sword of pure energy',
        textPrompt: 'A powerful dragon-themed attack card',
        cardType: CardType.ATTACK,
        cardFont: CardFont.FANTASY,
        cardFrame: CardFrame.CLASSIC,
        cardSize: CardSize.STANDARD,
        cardFormat: CardFormat.PORTRAIT,
        artStyle: ArtStyle.EPIC_FANTASY,
        artKeywords: 'hyperrealistic, 8k',
    },
    result: null,
};

const exportAsPng = async (element: HTMLElement | null, name: string) => {
    if (!element) return;
    try {
        const dataUrl = await toPng(element, { 
            cacheBust: true, 
            pixelRatio: 2,
            backgroundColor: '#111827'
        });
        const link = document.createElement('a');
        link.download = `${name.replace(/\s+/g, '_').toLowerCase() || 'custom_card'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export card as PNG', error);
        alert('Could not export the card. Please try again.');
    }
};

export const CardGenerator: React.FC = () => {
    const { state, setState, undo, redo, canUndo, canRedo, resetState } = useHistoryState<CardGenerationState>(initialCardState);
    const { config, result } = state;
    
    // Local state for live input updates to avoid flooding history
    const [liveConfig, setLiveConfig] = useState(config);
    const [liveSelectedImage, setLiveSelectedImage] = useState(result?.selectedImage || '');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cardPreviewRef = useRef<HTMLDivElement>(null);
    
    // Sync local state when history changes (undo/redo)
    useEffect(() => {
        setLiveConfig(config);
        setLiveSelectedImage(result?.selectedImage || '');
    }, [config, result]);


    const handleGenerate = async () => {
        if (!liveConfig.artPrompt || !liveConfig.textPrompt) {
            setError("Please fill in both art and text prompts.");
            return;
        }
        setIsLoading(true);
        setError(null);

        let aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '3:4';
        if (liveConfig.cardSize === CardSize.SQUARE) aspectRatio = '1:1';
        else if (liveConfig.cardFormat === CardFormat.HORIZONTAL) aspectRatio = '4:3';
        else if (liveConfig.cardSize === CardSize.TAROT) aspectRatio = '9:16';
        
        try {
            const apiResult = await generateCardContent(liveConfig.artPrompt, liveConfig.textPrompt, liveConfig.artStyle, liveConfig.artKeywords, aspectRatio);
            const newResult = {
                generatedImages: apiResult.imageUrls,
                selectedImage: apiResult.imageUrls[0] || '',
                generatedText: apiResult.text,
            };
            setState({ config: liveConfig, result: newResult });
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const cardData: CardData = {
        name: result?.generatedText.name || '',
        description: result?.generatedText.description || '',
        flavorText: result?.generatedText.flavorText || '',
        artUrl: liveSelectedImage,
        cardType: config.cardType,
        cardFont: config.cardFont,
        cardFrame: config.cardFrame,
        cardSize: config.cardSize,
        cardFormat: config.cardFormat
    };
    
    const handleExport = useCallback(() => {
        exportAsPng(cardPreviewRef.current, cardData.name);
    }, [cardData.name]);

    const handleConfigChange = (field: keyof CardGenerationState['config'], value: any) => {
        setLiveConfig(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-cyan-400 font-scifi">Card Configuration</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Structure</label>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries({
                            cardType: Object.values(CardType),
                            cardFont: Object.values(CardFont),
                            cardFrame: Object.values(CardFrame),
                            cardSize: Object.values(CardSize),
                            cardFormat: Object.values(CardFormat),
                            artStyle: Object.values(ArtStyle),
                        }).map(([key, options]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-xs font-medium text-gray-400 capitalize">{key.replace('card', '').replace('art', '')}</label>
                                <select id={key} value={liveConfig[key as keyof typeof liveConfig]} onChange={e => handleConfigChange(key as keyof CardGenerationState['config'], e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="artKeywords" className="block text-sm font-medium text-gray-300">Art Keywords</label>
                    <input id="artKeywords" value={liveConfig.artKeywords} onChange={e => handleConfigChange('artKeywords', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., hyperrealistic, 8k" />
                </div>
                <div>
                    <label htmlFor="artPrompt" className="block text-sm font-medium text-gray-300">Art Prompt</label>
                    <textarea id="artPrompt" rows={3} value={liveConfig.artPrompt} onChange={e => handleConfigChange('artPrompt', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., A futuristic cyborg ninja..."></textarea>
                </div>
                <div>
                    <label htmlFor="textPrompt" className="block text-sm font-medium text-gray-300">Text & Theme Prompt</label>
                    <textarea id="textPrompt" rows={2} value={liveConfig.textPrompt} onChange={e => handleConfigChange('textPrompt', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., A fire spell..."></textarea>
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500 transition-colors duration-300">
                    <Sparkles size={20} />
                    {isLoading ? 'Forging Assets...' : 'Generate'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="md:col-span-1 lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-cyan-400 font-scifi">Live Preview</h2>
                     <div className="flex items-center gap-2">
                        <button onClick={undo} disabled={!canUndo || isLoading} className="flex items-center justify-center gap-1 bg-gray-700 text-white font-bold p-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Undo size={16} /></button>
                        <button onClick={redo} disabled={!canRedo || isLoading} className="flex items-center justify-center gap-1 bg-gray-700 text-white font-bold p-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Redo size={16} /></button>
                        <button onClick={handleExport} disabled={!result?.selectedImage || isLoading} className="flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Download size={16} /> Export</button>
                    </div>
                </div>
                <div className="flex justify-center items-start relative">
                    {isLoading && <Loader message="Generating..." />}
                    <CardPreview ref={cardPreviewRef} data={cardData} />
                </div>
                {result?.generatedImages && result.generatedImages.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Select Art</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {result.generatedImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Generated art option ${index + 1}`}
                                    onClick={() => setLiveSelectedImage(imgUrl)}
                                    className={`w-full aspect-square object-cover rounded-md cursor-pointer border-4 ${liveSelectedImage === imgUrl ? 'border-cyan-500' : 'border-transparent hover:border-gray-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
