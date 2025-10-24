import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: This key is automatically injected. Do not change it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = "gemini-2.5-flash";
const imageModel = "imagen-4.0-generate-001";

interface GeneratedText {
  name: string;
  description: string;
  flavorText: string;
}

export const generateCardContent = async (artPrompt: string, textPrompt: string, artStyle: string, artKeywords: string, aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'): Promise<{ imageUrls: string[]; text: GeneratedText }> => {
  try {
    const textPromise = ai.models.generateContent({
      model: textModel,
      contents: `Based on the following theme, create content for a game card. Theme: "${textPrompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'A creative and fitting name for the card (e.g., "Blade of Judgment").',
            },
            description: {
              type: Type.STRING,
              description: 'The card\'s game effect or action (e.g., "Deals 15 damage to all adjacent enemies. Requires 3 energy.").',
            },
            flavorText: {
              type: Type.STRING,
              description: 'A short, evocative, and thematic text for lore or mood (e.g., "It was once a forest, until they came.").',
            },
          },
          required: ["name", "description", "flavorText"],
        },
      },
    });

    const fullArtPrompt = `${artPrompt}, style of ${artStyle}, ${artKeywords}, high detail, digital painting`;

    const imagePromise = ai.models.generateImages({
      model: imageModel,
      prompt: fullArtPrompt,
      config: {
        numberOfImages: 4,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/png'
      },
    });

    const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

    const generatedText: GeneratedText = JSON.parse(textResponse.text);
    const imageUrls = imageResponse.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);

    return { imageUrls, text: generatedText };
  } catch (error) {
    console.error("Error generating card content:", error);
    throw new Error("Failed to generate content from AI. Please check your prompts and try again.");
  }
};


export const generateMapTile = async (prompt: string, artKeywords: string): Promise<string[]> => {
    try {
        const fullPrompt = `${prompt}, ${artKeywords}, top-down view, game asset, seamless texture, high detail`;
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: fullPrompt,
            config: {
              numberOfImages: 4,
              aspectRatio: '1:1',
              outputMimeType: 'image/png'
            },
          });

        const imageUrls = imageResponse.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
        return imageUrls;

    } catch (error) {
        console.error("Error generating map tile:", error);
        throw new Error("Failed to generate map tile from AI. Please check your prompt and try again.");
    }
};
