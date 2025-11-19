import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Platform, GeneratedContent, Tone } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper schema for a single platform's content
const platformContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The social media post content in Chinese." },
    imagePrompt: { type: Type.STRING, description: "A detailed English prompt for an AI image generator that matches the post's theme." }
  },
  required: ["text", "imagePrompt"]
};

// Main response schema
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    [Platform.LinkedIn]: platformContentSchema,
    [Platform.Twitter]: platformContentSchema,
    [Platform.Instagram]: platformContentSchema,
  },
  required: [Platform.LinkedIn, Platform.Twitter, Platform.Instagram]
};

export const generateSocialText = async (idea: string, tone: Tone): Promise<Omit<GeneratedContent, 'linkedin' | 'twitter' | 'instagram'> & { [key in Platform]: { text: string, imagePrompt: string } }> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are a world-class social media manager for a Chinese audience.
    Your task is to generate social media content for LinkedIn, Twitter, and Instagram based on a user's idea.
    
    Language: The post content MUST be in Simplified Chinese (简体中文).
    Tone: Adapt the writing style strictly to the requested tone: ${tone}.
    
    Guidelines per platform:
    1. LinkedIn: Professional, insightful, longer form, uses professional hashtags. Structured for readability.
    2. Twitter (X): Short, punchy, engaging, under 280 characters equivalent impact. Uses trending hashtags.
    3. Instagram: Visual-focused storytelling, engaging hook, uses line breaks and many relevant hashtags at the bottom.
    
    Image Prompts: Provide a creative, high-quality image generation prompt for EACH platform. The prompt should be in ENGLISH to ensure best compatibility with image models. The image should visually represent the post's core message and tone.
    `;

    const prompt = `Idea: ${idea}\nTone: ${tone}`;

    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const generateSocialImage = async (prompt: string, aspectRatio: '16:9' | '3:4' | '1:1'): Promise<string> => {
  try {
    const model = "imagen-4.0-generate-001";
    
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/jpeg',
      }
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
       throw new Error("No image generated");
    }

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a placeholder on error to not break the UI completely, or throw to handle in UI
    throw error;
  }
};