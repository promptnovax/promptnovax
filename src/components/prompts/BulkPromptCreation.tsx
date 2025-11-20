
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Zap,
  CheckCircle,
  AlertCircle,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface BulkPrompt {
  id: string;
  input: string;
  platform: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  result?: string;
  error?: string;
}

export const BulkPromptCreation = () => {
  const [prompts, setPrompts] = useState<BulkPrompt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bulkSettings, setBulkSettings] = useState({
    platform: '',
    outputFormat: 'professional'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        // Parse CSV or simple text format
        const lines = text.split('\n').filter(line => line.trim());
        const newPrompts: BulkPrompt[] = lines.map((line, index) => ({
          id: Date.now().toString() + index,
          input: line.trim(),
          platform: bulkSettings.platform || 'chatgpt',
          status: 'pending'
        }));
        
        setPrompts(newPrompts);
        toast.success(`Loaded ${newPrompts.length} prompts from file`);
      } catch (error) {
        toast.error("Failed to parse file");
      }
    };
    reader.readAsText(file);
  };

  const addManualPrompt = () => {
    const newPrompt: BulkPrompt = {
      id: Date.now().toString(),
      input: '',
      platform: bulkSettings.platform || 'chatgpt',
      status: 'pending'
    };
    setPrompts([...prompts, newPrompt]);
  };

  const updatePrompt = (id: string, input: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, input } : p));
  };

  const removePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const generateBulkPrompts = async () => {
    if (prompts.length === 0) {
      toast.error("No prompts to generate");
      return;
    }

    if (!bulkSettings.platform) {
      toast.error("Please select a platform");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate bulk generation
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      
      // Update status to generating
      setPrompts(prev => prev.map(p => 
        p.id === prompt.id ? { ...p, status: 'generating' } : p
      ));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock generation result
      const mockResult = `You are an expert ${bulkSettings.platform} user. 

**Task**: ${prompt.input}

**Requirements**:
- Provide detailed and professional output
- Use ${bulkSettings.outputFormat} tone
- Include relevant examples and explanations
- Ensure accuracy and clarity

Please proceed with the task following these guidelines.`;

      // Update with result
      setPrompts(prev => prev.map(p => 
        p.id === prompt.id ? { 
          ...p, 
          status: 'completed',
          result: mockResult
        } : p
      ));

      setProgress(((i + 1) / prompts.length) * 100);
    }

    setIsProcessing(false);
    toast.success("Bulk generation completed!");
  };

  const exportResults = () => {
    const completedPrompts = prompts.filter(p => p.status === 'completed');
    if (completedPrompts.length === 0) {
      toast.error("No completed prompts to export");
      return;
    }

    const csvContent = [
      ['Input', 'Platform', 'Generated Prompt'].join(','),
      ...completedPrompts.map(p => [
        `"${p.input.replace(/"/g, '""')}"`,
        p.platform,
        `"${(p.result || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-prompts-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Results exported successfully!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'generating': return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const completedCount = prompts.filter(p => p.status === 'completed').length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>Bulk Prompt Creation</span>
          {prompts.length > 0 && (
            <Badge variant="secondary">{completedCount}/{prompts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Target Platform</Label>
            <Select value={bulkSettings.platform} onValueChange={(value) => setBulkSettings({ ...bulkSettings, platform: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chatgpt">ChatGPT</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="midjourney">Midjourney</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Output Format</Label>
            <Select value={bulkSettings.outputFormat} onValueChange={(value) => setBulkSettings({ ...bulkSettings, outputFormat: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Upload Ideas</Label>
            <Button size="sm" variant="outline" onClick={addManualPrompt}>
              Add Manually
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Upload CSV or TXT file</p>
              <p className="text-xs text-gray-500">One prompt idea per line</p>
            </label>
          </div>
        </div>

        {/* Prompts List */}
        {prompts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Prompt Queue ({prompts.length})</Label>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={generateBulkPrompts}
                  disabled={isProcessing || prompts.length === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Generating...' : 'Generate All'}
                </Button>
                {completedCount > 0 && (
                  <Button size="sm" variant="outline" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                )}
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-gray-600">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            )}

            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <Card key={prompt.id} className="p-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(prompt.status)}
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Enter prompt idea..."
                          value={prompt.input}
                          onChange={(e) => updatePrompt(prompt.id, e.target.value)}
                          className="min-h-[60px]"
                          disabled={isProcessing}
                        />
                        {prompt.result && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
                            <strong>Generated:</strong> {prompt.result.substring(0, 100)}...
                          </div>
                        )}
                        {prompt.error && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs text-red-600">
                            <strong>Error:</strong> {prompt.error}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePrompt(prompt.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {prompts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No prompts loaded</p>
            <p className="text-sm">Upload a file or add prompts manually</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


