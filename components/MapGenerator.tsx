import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapPreview } from './MapPreview';
import { generateMap } from '../services/geminiService';
import { MapData, MapType, MapStyle, GridType } from '../types';
import { Loader } from './common/Loader';
import { Download, Sparkles, Undo, Redo } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useHistoryState } from '../hooks/useHistoryState';

interface MapGenerationState {
    config: {
        prompt: string;
        mapType: MapType;
        mapStyle: MapStyle;
        gridType: GridType;
    };
    result: {
        mapUrl: string;
    } | null;
}

const initialMapState: MapGenerationState = {
    config: {
        prompt: 'a bustling port town with a large marketplace and a mysterious lighthouse',
        mapType: MapType.CITY,
        mapStyle: MapStyle.FANTASY_ATLAS,
        gridType: GridType.SQUARE,
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
        link.download = `${name.replace(/\s+/g, '_').toLowerCase() || 'custom_map'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export map as PNG', error);
        alert('Could not export the map. Please try again.');
    }
};


export const MapGenerator: React.FC = () => {
    const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState<MapGenerationState>(initialMapState);
    const { config, result } = state;
    
    const [liveConfig, setLiveConfig] = useState(config);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapPreviewRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setLiveConfig(config);
    }, [config]);

    const handleGenerate = async () => {
        if (!liveConfig.prompt) {
            setError("Please fill in the prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const mapUrl = await generateMap(liveConfig.prompt, liveConfig.mapType, liveConfig.mapStyle);
            const newResult = { mapUrl };
            setState({ config: liveConfig, result: newResult });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const mapData: MapData = {
        mapUrl: result?.mapUrl || '',
        mapType: config.mapType,
        mapStyle: config.mapStyle,
        gridType: config.gridType,
    };
    
    const handleExport = useCallback(() => {
        exportAsPng(mapPreviewRef.current, `${config.mapType}_${config.prompt.substring(0, 20)}`);
    }, [config.mapType, config.prompt]);

    const handleConfigChange = (field: keyof MapGenerationState['config'], value: any) => {
        setLiveConfig(prev => ({...prev, [field]: value}));
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-cyan-400 font-scifi">Map Configuration</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Map Settings</label>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries({
                            mapType: Object.values(MapType),
                            mapStyle: Object.values(MapStyle),
                            gridType: Object.values(GridType),
                        }).map(([key, options]) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-xs font-medium text-gray-400 capitalize">{key.replace('map', '')}</label>
                                <select id={key} value={liveConfig[key as keyof typeof liveConfig]} onChange={e => handleConfigChange(key as keyof MapGenerationState['config'], e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                    {options.map(o => <option key={String(o)} value={String(o)}>{String(o)}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">Map Prompt</label>
                    <textarea id="prompt" rows={4} value={liveConfig.prompt} onChange={e => handleConfigChange('prompt', e.target.value)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., A haunted forest with a forgotten ruin..."></textarea>
                </div>

                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500 transition-colors duration-300">
                    <Sparkles size={20} />
                    {isLoading ? 'Drawing Map...' : 'Generate Map'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="md:col-span-1 lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-cyan-400 font-scifi">Map Preview</h2>
                     <div className="flex items-center gap-2">
                        <button onClick={undo} disabled={!canUndo || isLoading} className="flex items-center justify-center gap-1 bg-gray-700 text-white font-bold p-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Undo size={16} /></button>
                        <button onClick={redo} disabled={!canRedo || isLoading} className="flex items-center justify-center gap-1 bg-gray-700 text-white font-bold p-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Redo size={16} /></button>
                        <button onClick={handleExport} disabled={!result?.mapUrl || isLoading} className="flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"><Download size={16} /> Export</button>
                    </div>
                </div>
                <div className="flex justify-center items-start relative">
                    {isLoading && <Loader message="Generating..." />}
                    <MapPreview ref={mapPreviewRef} data={mapData} />
                </div>
            </div>
        </div>
    );
};
