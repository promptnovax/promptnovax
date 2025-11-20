
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Palette, 
  Camera, 
  Lightbulb, 
  Users, 
  MapPin, 
  Clock,
  Plus,
  X,
  Sparkles,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface PromptElement {
  id: string;
  type: 'subject' | 'style' | 'lighting' | 'composition' | 'color' | 'mood' | 'setting' | 'camera';
  label: string;
  value: string;
}

const PROMPT_ELEMENTS = {
  subject: [
    { label: "Portrait", value: "portrait of a person" },
    { label: "Landscape", value: "beautiful landscape" },
    { label: "Abstract", value: "abstract art" },
    { label: "Architecture", value: "modern architecture" },
    { label: "Nature", value: "natural scenery" },
    { label: "Animal", value: "majestic animal" }
  ],
  style: [
    { label: "Photorealistic", value: "photorealistic" },
    { label: "Oil Painting", value: "oil painting style" },
    { label: "Watercolor", value: "watercolor painting" },
    { label: "Digital Art", value: "digital art" },
    { label: "Minimalist", value: "minimalist style" },
    { label: "Vintage", value: "vintage aesthetic" }
  ],
  lighting: [
    { label: "Golden Hour", value: "golden hour lighting" },
    { label: "Studio", value: "professional studio lighting" },
    { label: "Natural", value: "natural daylight" },
    { label: "Dramatic", value: "dramatic lighting" },
    { label: "Soft", value: "soft diffused light" },
    { label: "Neon", value: "neon lighting" }
  ],
  composition: [
    { label: "Close-up", value: "close-up shot" },
    { label: "Wide Angle", value: "wide angle view" },
    { label: "Rule of Thirds", value: "rule of thirds composition" },
    { label: "Symmetrical", value: "symmetrical composition" },
    { label: "Dynamic", value: "dynamic composition" },
    { label: "Centered", value: "centered composition" }
  ],
  color: [
    { label: "Vibrant", value: "vibrant colors" },
    { label: "Monochrome", value: "monochrome" },
    { label: "Pastel", value: "pastel colors" },
    { label: "High Contrast", value: "high contrast" },
    { label: "Warm Tones", value: "warm color palette" },
    { label: "Cool Tones", value: "cool color palette" }
  ],
  mood: [
    { label: "Serene", value: "serene and peaceful" },
    { label: "Energetic", value: "energetic and dynamic" },
    { label: "Mysterious", value: "mysterious atmosphere" },
    { label: "Joyful", value: "joyful and uplifting" },
    { label: "Melancholic", value: "melancholic mood" },
    { label: "Dramatic", value: "dramatic and intense" }
  ],
  setting: [
    { label: "Urban", value: "urban cityscape" },
    { label: "Forest", value: "dense forest" },
    { label: "Beach", value: "pristine beach" },
    { label: "Mountain", value: "mountain landscape" },
    { label: "Studio", value: "professional studio" },
    { label: "Interior", value: "elegant interior" }
  ],
  camera: [
    { label: "DSLR", value: "shot with DSLR camera" },
    { label: "Film", value: "analog film photography" },
    { label: "Macro", value: "macro lens" },
    { label: "Telephoto", value: "telephoto lens" },
    { label: "Wide Lens", value: "wide angle lens" },
    { label: "Polaroid", value: "polaroid style" }
  ]
};

interface VisualPromptBuilderProps {
  onPromptGenerated: (prompt: string) => void;
}

export const VisualPromptBuilder = ({ onPromptGenerated }: VisualPromptBuilderProps) => {
  const [selectedElements, setSelectedElements] = useState<PromptElement[]>([]);
  const [customElement, setCustomElement] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    generatePrompt();
  }, [selectedElements]);

  const generatePrompt = () => {
    if (selectedElements.length === 0) {
      setGeneratedPrompt('');
      return;
    }

    const promptParts = selectedElements.map(el => el.value);
    const prompt = promptParts.join(', ') + ', high quality, detailed, professional';
    setGeneratedPrompt(prompt);
  };

  const addElement = (type: keyof typeof PROMPT_ELEMENTS, element: { label: string; value: string }) => {
    const newElement: PromptElement = {
      id: Date.now().toString(),
      type,
      label: element.label,
      value: element.value
    };
    setSelectedElements([...selectedElements, newElement]);
  };

  const removeElement = (id: string) => {
    setSelectedElements(selectedElements.filter(el => el.id !== id));
  };

  const addCustomElement = () => {
    if (!customElement.trim()) return;
    
    const newElement: PromptElement = {
      id: Date.now().toString(),
      type: 'subject',
      label: 'Custom',
      value: customElement.trim()
    };
    setSelectedElements([...selectedElements, newElement]);
    setCustomElement('');
  };

  const clearAll = () => {
    setSelectedElements([]);
    setGeneratedPrompt('');
  };

  const usePrompt = () => {
    if (generatedPrompt) {
      onPromptGenerated(generatedPrompt);
      toast.success("Prompt applied to generator!");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'style': return <Palette className="h-4 w-4" />;
      case 'lighting': return <Lightbulb className="h-4 w-4" />;
      case 'composition': return <Camera className="h-4 w-4" />;
      case 'mood': return <Users className="h-4 w-4" />;
      case 'setting': return <MapPin className="h-4 w-4" />;
      case 'camera': return <Camera className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Visual Prompt Builder</span>
            <Badge variant="secondary">Midjourney & DALL-E</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Element Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Prompt Elements</h3>
                <Button size="sm" variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {Object.entries(PROMPT_ELEMENTS).map(([category, elements]) => (
                    <Card key={category} className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        {getCategoryIcon(category)}
                        <h4 className="font-medium capitalize">{category}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {elements.map((element) => (
                          <Button
                            key={element.label}
                            size="sm"
                            variant="outline"
                            onClick={() => addElement(category as keyof typeof PROMPT_ELEMENTS, element)}
                            className="justify-start text-left h-auto py-2 px-3"
                          >
                            <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="text-xs">{element.label}</span>
                          </Button>
                        ))}
                      </div>
                    </Card>
                  ))}
                  
                  {/* Custom Element */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Custom Element</h4>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add custom description..."
                        value={customElement}
                        onChange={(e) => setCustomElement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomElement()}
                      />
                      <Button size="sm" onClick={addCustomElement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </div>

            {/* Selected Elements & Preview */}
            <div className="space-y-4">
              <h3 className="font-medium">Selected Elements</h3>
              
              {selectedElements.length > 0 ? (
                <div className="space-y-2">
                  {selectedElements.map((element) => (
                    <div key={element.id} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(element.type)}
                        <span className="text-sm">{element.value}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeElement(element.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No elements selected</p>
                  <p className="text-sm">Choose elements to build your prompt</p>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="h-4 w-4" />
                  <h4 className="font-medium">Generated Prompt</h4>
                </div>
                
                {generatedPrompt ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm">{generatedPrompt}</p>
                    </div>
                    <Button onClick={usePrompt} className="w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use This Prompt
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500">
                    <p className="text-sm">Your generated prompt will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


