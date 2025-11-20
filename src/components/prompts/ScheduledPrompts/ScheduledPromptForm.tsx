
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { NewPromptForm } from "./types";

interface ScheduledPromptFormProps {
  newPrompt: NewPromptForm;
  setNewPrompt: (prompt: NewPromptForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ScheduledPromptForm = ({ 
  newPrompt, 
  setNewPrompt, 
  onSubmit, 
  onCancel 
}: ScheduledPromptFormProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter prompt title"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt"
              value={newPrompt.prompt}
              onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select value={newPrompt.platform} onValueChange={(value) => setNewPrompt({ ...newPrompt, platform: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="midjourney">Midjourney</SelectItem>
                  <SelectItem value="dalle">DALL-E</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newPrompt.scheduledDate}
                onChange={(e) => setNewPrompt({ ...newPrompt, scheduledDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newPrompt.scheduledTime}
              onChange={(e) => setNewPrompt({ ...newPrompt, scheduledTime: e.target.value })}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={onSubmit}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Prompt
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


