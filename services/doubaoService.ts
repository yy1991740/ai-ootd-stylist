import { FashionAnalysis, Language, ModelId } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeOutfitImage = async (file: File, lang: Language, modelId: ModelId): Promise<FashionAnalysis> => {
  try {
    const base64Data = await fileToGenerativePart(file);
    
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64Data,
            lang,
            modelId,
            fileType: file.type
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
    }

    const data = await response.json();
    return data as FashionAnalysis;

  } catch (error) {
    console.error("Error analyzing outfit:", error);
    throw error;
  }
};
