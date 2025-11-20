
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PromptGeneratorHeaderProps {
  onBack: () => void;
  promptScore: number | null;
}

export const PromptGeneratorHeader = ({ onBack, promptScore }: PromptGeneratorHeaderProps) => {
  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Advanced Prompt Generator</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            All Features Unlocked (Dev Mode)
          </Badge>
          {promptScore && (
            <Badge variant={promptScore >= 90 ? "default" : promptScore >= 80 ? "secondary" : "outline"}>
              Score: {promptScore}/100
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
};


