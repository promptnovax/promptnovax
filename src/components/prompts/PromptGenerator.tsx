
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  History,
  Calendar,
  Palette,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { PromptOutput } from "@/components/prompts/PromptOutput";
import { VersionHistory } from "@/components/prompts/VersionHistory";
import { ScheduledPrompts } from "@/components/prompts/ScheduledPrompts";
import { VisualPromptBuilder } from "@/components/prompts/VisualPromptBuilder";
import { ExportOptions } from "@/components/prompts/ExportOptions";
import { BulkPromptCreation } from "@/components/prompts/BulkPromptCreation";
import { PromptGeneratorHeader } from "@/components/prompts/PromptGenerator/PromptGeneratorHeader";
import { PromptConfigurationForm } from "@/components/prompts/PromptGenerator/PromptConfigurationForm";
import { usePromptGeneration } from "@/components/prompts/PromptGenerator/usePromptGeneration";
import { aiPlatforms } from "@/components/prompts/PromptGenerator/promptData";

interface PromptGeneratorProps {
  onBack: () => void;
}

export const PromptGenerator = ({ onBack }: PromptGeneratorProps) => {
  const {
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
    resetPromptEdits
  } = usePromptGeneration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <PromptGeneratorHeader onBack={onBack} promptScore={promptScore} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Generator</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Visual Builder</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Bulk Creation</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <PromptConfigurationForm
                  userInput={userInput}
                  setUserInput={setUserInput}
                  promptType={promptType}
                  setPromptType={setPromptType}
                  aiPlatform={aiPlatform}
                  setAiPlatform={setAiPlatform}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat}
                  language={language}
                  setLanguage={setLanguage}
                  visualReference={visualReference}
                  setVisualReference={setVisualReference}
                  referenceType={referenceType}
                  setReferenceType={setReferenceType}
                  isGenerating={isGenerating}
                  generatedPrompt={generatedPrompt}
                  onGenerate={generatePrompt}
                  onEnhance={enhancePrompt}
                />
              </div>

              {/* Output Section */}
              <div>
                {generatedPrompt ? (
                  <PromptOutput 
                    prompt={generatedPrompt} 
                    score={promptScore} 
                    platform={aiPlatforms.find(p => p.value === aiPlatform)}
                    onCopy={() => toast.success("Prompt copied to clipboard!")}
                    onDownload={() => toast.success("Prompt downloaded successfully!")}
                    onPromptChange={setGeneratedPrompt}
                    hasEdits={hasPromptChanges}
                    onResetEdits={resetPromptEdits}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        Your Generated Prompt Will Appear Here
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Fill in the form and click "Generate Prompt" to get started
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          🚀 <strong>Phase 2:</strong> Advanced features now available!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual">
            <VisualPromptBuilder onPromptGenerated={handleVisualPromptGenerated} />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkPromptCreation />
          </TabsContent>

          <TabsContent value="history">
            <VersionHistory onRestoreVersion={restoreVersion} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduledPrompts />
          </TabsContent>

          <TabsContent value="export">
            <ExportOptions 
              prompt={generatedPrompt}
              metadata={{
                platform: aiPlatforms.find(p => p.value === aiPlatform)?.label,
                score: promptScore || undefined,
                timestamp: new Date()
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


