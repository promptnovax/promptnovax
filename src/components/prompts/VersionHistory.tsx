
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  History, 
  Clock, 
  Star, 
  Copy, 
  Trash2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface PromptVersion {
  id: string;
  timestamp: Date;
  prompt: string;
  platform: string;
  score: number;
  isFavorite: boolean;
}

interface VersionHistoryProps {
  onRestoreVersion: (prompt: string) => void;
}

export const VersionHistory = ({ onRestoreVersion }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    // Load versions from localStorage (in a real app, this would be from a database)
    const savedVersions = localStorage.getItem('prompt-versions');
    if (savedVersions) {
      const parsed: PromptVersion[] = JSON.parse(savedVersions).map((version: PromptVersion & { timestamp: string }) => ({
        ...version,
        timestamp: new Date(version.timestamp),
      }));
      setVersions(parsed);
    }
  }, []);

  const persistVersions = (data: PromptVersion[]) => {
    localStorage.setItem(
      'prompt-versions',
      JSON.stringify(
        data.map(version => ({
          ...version,
          timestamp: version.timestamp.toISOString(),
        }))
      )
    );
  };

  const saveVersion = (prompt: string, platform: string, score: number) => {
    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      timestamp: new Date(),
      prompt,
      platform,
      score,
      isFavorite: false
    };

    const updatedVersions = [newVersion, ...versions.slice(0, 49)]; // Keep only last 50
    setVersions(updatedVersions);
    persistVersions(updatedVersions);
  };

  const toggleFavorite = (id: string) => {
    const updatedVersions = versions.map(v => 
      v.id === id ? { ...v, isFavorite: !v.isFavorite } : v
    );
    setVersions(updatedVersions);
    persistVersions(updatedVersions);
  };

  const deleteVersion = (id: string) => {
    const updatedVersions = versions.filter(v => v.id !== id);
    setVersions(updatedVersions);
    persistVersions(updatedVersions);
    toast.success("Version deleted");
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Version History</span>
          <Badge variant="secondary">{versions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No versions saved yet</p>
              <p className="text-sm">Generated prompts will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div 
                  key={version.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedVersion === version.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {version.platform}
                        </Badge>
                        {version.score && (
                          <Badge variant={version.score >= 90 ? "default" : "secondary"} className="text-xs">
                            {version.score}/100
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2">
                        {version.prompt.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(version.id);
                        }}
                      >
                        <Star className={`h-4 w-4 ${version.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        selectedVersion === version.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {selectedVersion === version.id && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-3">
                        <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          {version.prompt}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              onRestoreVersion(version.prompt);
                              toast.success("Version restored!");
                            }}
                          >
                            Restore Version
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyPrompt(version.prompt)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteVersion(version.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


