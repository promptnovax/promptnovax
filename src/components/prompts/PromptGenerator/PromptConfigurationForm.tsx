
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  RefreshCw, 
  Crown, 
  ImageIcon, 
  VideoIcon,
  Upload,
  Link,
  Languages
} from "lucide-react";
import { promptTypes, aiPlatforms, outputFormats, languages } from "./promptData";

interface PromptConfigurationFormProps {
  userInput: string;
  setUserInput: (value: string) => void;
  promptType: string;
  setPromptType: (value: string) => void;
  aiPlatform: string;
  setAiPlatform: (value: string) => void;
  outputFormat: string;
  setOutputFormat: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  visualReference: string;
  setVisualReference: (value: string) => void;
  referenceType: string;
  setReferenceType: (value: string) => void;
  isGenerating: boolean;
  generatedPrompt: string;
  onGenerate: () => void;
  onEnhance: () => void;
}

export const PromptConfigurationForm = ({
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
  isGenerating,
  generatedPrompt,
  onGenerate,
  onEnhance
}: PromptConfigurationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Prompt Configuration</span>
        </CardTitle>
        <CardDescription>
          Describe your task and configure the prompt settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Input */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Describe your task or idea *
          </Label>
          <Textarea
            placeholder="e.g., I want to build a todo app with React and Supabase, or Create a futuristic cityscape image, or Generate a video of ocean waves..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Visual Reference Section */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            Visual Reference
            <Crown className="h-3 w-3 text-yellow-500" />
          </Label>
          <Select value={referenceType} onValueChange={setReferenceType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose reference type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No reference</SelectItem>
              <SelectItem value="image">Image reference</SelectItem>
              <SelectItem value="video">Video reference</SelectItem>
              <SelectItem value="url">URL reference</SelectItem>
            </SelectContent>
          </Select>

          {referenceType !== "none" && (
            <div className="mt-3 space-y-3">
              {referenceType === "url" ? (
                <div>
                  <Label className="text-sm">Reference URL</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Paste image/video URL here"
                      value={visualReference}
                      onChange={(e) => setVisualReference(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {referenceType === "image" ? (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    ) : (
                      <VideoIcon className="h-8 w-8 text-gray-400" />
                    )}
                    <p className="text-sm text-gray-500">
                      Drop your {referenceType} here or click to upload
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Prompt Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Prompt Category *
          </Label>
          <Select value={promptType} onValueChange={setPromptType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {promptTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.desc}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Platform */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Target AI Platform *
          </Label>
          <Select value={aiPlatform} onValueChange={setAiPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI platform" />
            </SelectTrigger>
            <SelectContent>
              {aiPlatforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{platform.label}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {platform.category}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Output Format */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Output Format *
          </Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Choose format" />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem 
                  key={format.value} 
                  value={format.value}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {format.label}
                      </div>
                      <div className="text-xs text-gray-500">{format.desc}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div>
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Output Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <div className="flex space-x-3">
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Prompt"}
          </Button>
          {generatedPrompt && (
            <Button 
              onClick={onEnhance} 
              disabled={isGenerating}
              variant="outline"
              className="relative"
            >
              <Zap className="h-4 w-4 mr-2" />
              Enhance
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


