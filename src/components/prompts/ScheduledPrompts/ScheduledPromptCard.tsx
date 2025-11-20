
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Send, Trash2 } from "lucide-react";
import { ScheduledPrompt } from "./types";

interface ScheduledPromptCardProps {
  prompt: ScheduledPrompt;
  onSendNow: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ScheduledPromptCard = ({ prompt, onSendNow, onDelete }: ScheduledPromptCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{prompt.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4" />
            <span>{prompt.scheduledDate.toLocaleString()}</span>
            <Badge variant="outline">{prompt.platform}</Badge>
            <Badge className={getStatusColor(prompt.status)}>
              {prompt.status}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-1">
          {prompt.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSendNow(prompt.id)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(prompt.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {prompt.prompt}
      </p>
    </Card>
  );
};


