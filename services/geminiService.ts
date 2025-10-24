import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ArtStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCardContent(
    artPrompt: string,
    textPrompt: string,
    artStyle: ArtStyle,
    artKeywords: string,
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<{ imageUrls: string[]; text: { name: string; description: string; flavorText: string; } }> {
    
    // Generate Image
    const fullArtPrompt = `A high-quality, professional game card art of ${artPrompt}. Style: ${artStyle}. Keywords: ${artKeywords}.`;
    
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullArtPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });

    const imageUrls = imageResponse.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);

    if (imageUrls.length === 0) {
        throw new Error("Image generation failed to produce any images.");
    }

    // Generate Text
    const fullTextPrompt = `Based on this theme: "${textPrompt}", generate the content for a game card. Provide a creative name, a concise description of its abilities or effects, and a short, thematic flavor text.`;

    const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullTextPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'The name of the card.' },
                    description: { type: Type.STRING, description: 'The card\'s abilities or effects.' },
                    flavorText: { type: Type.STRING, description: 'Thematic text to add lore.' },
                },
                required: ["name", "description", "flavorText"],
            },
        },
    });

    const jsonStr = textResponse.text.trim();
    const text = JSON.parse(jsonStr);

    return { imageUrls, text };
}

export async function generateMap(
    prompt: string,
    mapType: string,
    mapStyle: string,
): Promise<string> {
    const fullPrompt = `A top-down TTRPG battle map of a ${mapType}, ${prompt}. Style: ${mapStyle}. High detail, tabletop view.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }

    throw new Error("Map image generation failed.");
}
