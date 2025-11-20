
import { useState } from "react";
import { toast } from "sonner";
import { aiPlatforms } from "./promptData";
import { requestPromptGeneration } from "@/lib/promptGeneratorService";

export const usePromptGeneration = () => {
  const [userInput, setUserInput] = useState("");
  const [promptType, setPromptType] = useState("");
  const [aiPlatform, setAiPlatform] = useState("");
  const [outputFormat, setOutputFormat] = useState("casual");
  const [language, setLanguage] = useState("english");
  const [visualReference, setVisualReference] = useState("");
  const [referenceType, setReferenceType] = useState("none");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptScore, setPromptScore] = useState<number | null>(null);

  const persistVersion = (prompt: string, score: number | null) => {
    try {
      const existing = JSON.parse(localStorage.getItem("prompt-versions") || "[]") as Array<any>;
      const normalizedHistory = existing.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp ?? new Date().toISOString(),
      }));

      const newVersion = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        prompt,
        platform: aiPlatforms.find((p) => p.value === aiPlatform)?.label || aiPlatform || "Universal",
        score: score ?? undefined,
        isFavorite: false,
      };

      normalizedHistory.unshift(newVersion);
      localStorage.setItem("prompt-versions", JSON.stringify(normalizedHistory.slice(0, 50)));
    } catch (error) {
      console.warn("Failed to persist prompt history", error);
    }
  };

  const generatePrompt = async () => {
    if (!userInput.trim() || !promptType || !aiPlatform || !outputFormat) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setPromptScore(null);

    try {
      const response = await requestPromptGeneration({
        mode: "generate",
        userInput: userInput.trim(),
        promptType,
        aiPlatform,
        outputFormat,
        language,
        visualReference: visualReference?.trim() || undefined,
        referenceType,
      });

      setGeneratedPrompt(response.prompt);
      setOriginalPrompt(response.prompt);
      setPromptScore(response.score ?? null);
      persistVersion(response.prompt, response.score ?? null);
      toast.success("Prompt generated successfully!");
      if (response.metadata?.fallback) {
        toast.message("Offline generator used", {
          description: "Start the backend server to switch back to live AI."
        });
      }
    } catch (error: any) {
      console.error("Prompt generation failed", error);
      toast.error(error.message || "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const enhancePrompt = async () => {
    if (!generatedPrompt) {
      toast.message("Generate a prompt before enhancing.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await requestPromptGeneration({
        mode: "enhance",
        userInput: userInput.trim() || "Refine the existing prompt",
        promptType: promptType || "app-development",
        aiPlatform: aiPlatform || "universal",
        outputFormat,
        language,
        visualReference: visualReference?.trim() || undefined,
        referenceType,
        existingPrompt: generatedPrompt,
      });

      setGeneratedPrompt(response.prompt);
      setOriginalPrompt(response.prompt);
      setPromptScore(response.score ?? promptScore ?? null);
      persistVersion(response.prompt, response.score ?? promptScore ?? null);
      toast.success("Prompt enhanced successfully!");
      if (response.metadata?.fallback) {
        toast.message("Offline generator used", {
          description: "Start the backend server to switch back to live AI."
        });
      }
    } catch (error: any) {
      console.error("Prompt enhancement failed", error);
      toast.error(error.message || "Failed to enhance prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const restoreVersion = (prompt: string) => {
    setGeneratedPrompt(prompt);
    setOriginalPrompt(prompt);
  };

  const resetPromptEdits = () => {
    setGeneratedPrompt(originalPrompt);
  };

  const hasPromptChanges = Boolean(generatedPrompt && originalPrompt && generatedPrompt !== originalPrompt);

  const handleVisualPromptGenerated = (prompt: string) => {
    setUserInput(prompt);
  };

  return {
    userInput,
    setUserInput,
    promptType,
    setPromptType,
    aiPlatform,
    setAiPlatform,
    outputFormat,
    setOutputFormat,
    language,
    setLanguage,
    visualReference,
    setVisualReference,
    referenceType,
    setReferenceType,
    generatedPrompt,
    setGeneratedPrompt,
    isGenerating,
    promptScore,
    generatePrompt,
    enhancePrompt,
    restoreVersion,
    handleVisualPromptGenerated,
    hasPromptChanges,
    resetPromptEdits,
  };
};

