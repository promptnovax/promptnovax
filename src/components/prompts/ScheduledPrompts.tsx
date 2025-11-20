
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Plus } from "lucide-react";
import { useScheduledPrompts } from "./ScheduledPrompts/useScheduledPrompts";
import { ScheduledPromptForm } from "./ScheduledPrompts/ScheduledPromptForm";
import { ScheduledPromptCard } from "./ScheduledPrompts/ScheduledPromptCard";

export const ScheduledPrompts = () => {
  const [isCreating, setIsCreating] = useState(false);
  const {
    scheduledPrompts,
    newPrompt,
    setNewPrompt,
    createScheduledPrompt,
    deleteScheduledPrompt,
    sendNow
  } = useScheduledPrompts();

  const handleCreatePrompt = () => {
    const success = createScheduledPrompt();
    if (success) {
      setIsCreating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Scheduled Prompts</span>
            <Badge variant="secondary">{scheduledPrompts.length}</Badge>
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsCreating(!isCreating)}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isCreating && (
          <ScheduledPromptForm
            newPrompt={newPrompt}
            setNewPrompt={setNewPrompt}
            onSubmit={handleCreatePrompt}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <ScrollArea className="h-[400px]">
          {scheduledPrompts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No scheduled prompts</p>
              <p className="text-sm">Schedule prompts for later use</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPrompts.map((prompt) => (
                <ScheduledPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSendNow={sendNow}
                  onDelete={deleteScheduledPrompt}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


