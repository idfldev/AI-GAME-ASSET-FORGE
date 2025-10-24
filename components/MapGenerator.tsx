import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapPreview } from './MapPreview';
import { generateMapTile } from '../services/geminiService';
import { MapShape, MapTerrain } from '../types';
import { Loader } from './common/Loader';
import { Download, Sparkles, Undo, Redo } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useHistoryState } from '../hooks/useHistoryState';


interface MapGenerationState {
    config: {
        prompt: string;
        shape: MapShape;
        terrain: MapTerrain;
        artKeywords: string;
    };
    result: {
        generatedImages: string[];
        selectedImage: string;
    } | null;
}

const initialMapState: MapGenerationState = {
    config: {
        prompt: 'A lush, dense forest tile with a small stream',
        shape: MapShape.HEXAGON,
        terrain: MapTerrain.FOREST,
        artKeywords: 'stylized, vibrant colors',
    },
    result: null,
};

const exportAsPng = async (element: HTMLElement | null, name: string) => {
    if (!element) return;
    try {
        const dataUrl = await toPng(element, { 
            cacheBust: true, 
            pixelRatio: 2, 
            backgroundColor: 'transparent'
        });
        const link = document.createElement('a');
        link.download = `${name.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export map tile as PNG', error);
        alert('Could not export the tile. Please try again.');
    }
};

export const MapGenerator: React.FC = () => {
    const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState<MapGenerationState>(initialMapState);
    const { config, result } = state;
    
    const [liveConfig, setLiveConfig] = useState(config);
    const [liveSelectedImage, setLiveSelectedImage] = useState(result?.selectedImage || '');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapPreviewRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setLiveConfig(config);
        setLiveSelectedImage(result?.selectedImage || '');
    }, [config, result]);

    const handleGenerate = async () => {
        const fullPrompt = `${liveConfig.prompt}, ${liveConfig.terrain} terrain`;
        if (!fullPrompt) {
            setError("Please fill in the art prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const imageUrls = await generateMapTile(fullPrompt, liveConfig.artKeywords);
            const newResult = {
                generatedImages: imageUrls,
                selectedImage: imageUrls[0] || '',
            };
            setState({ config: liveConfig, result: newResult });
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleExport = useCallback(() => {
        exportAsPng(mapPreviewRef.current, `${config.terrain}_tile`);
    }, [config.terrain]);
    
    const handleConfigChange = (field: keyof MapGenerationState['config'], value: any) => {
        setLiveConfig(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-cyan-400 font-scifi">Map Tile Configuration</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tile Structure</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tileShape" className="block text-xs font-medium text-gray-400">Shape</label>
                            <select id="tileShape" value={liveConfig.shape} onChange={e => handleConfigChange('shape', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                {Object.values(MapShape).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="terrainType" className="block text-xs font-medium text-gray-400">Terrain</label>
                            <select id="terrainType" value={liveConfig.terrain} onChange={e => handleConfigChange('terrain', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                {Object.values(MapTerrain).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="artKeywords" className="block text-sm font-medium text-gray-300">Art Keywords</label>
                    <input id="artKeywords" value={liveConfig.artKeywords} onChange={e => handleConfigChange('artKeywords', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., stylized, vibrant colors" />
                </div>
                <div>
                    <label htmlFor="artPrompt" className="block text-sm font-medium text-gray-300">Art Prompt</label>
                    <textarea id="artPrompt" rows={3} value={liveConfig.prompt} onChange={e => handleConfigChange('prompt', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., A cracked desert landscape..."></textarea>
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500 transition-colors duration-300">
                    <Sparkles size={20} />
                    {isLoading ? 'Forging Tile...' : 'Generate'}
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
                    <MapPreview ref={mapPreviewRef} artUrl={liveSelectedImage} shape={config.shape} />
                </div>
                {result?.generatedImages && result.generatedImages.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Select Tile Art</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {result.generatedImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Generated tile option ${index + 1}`}
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
