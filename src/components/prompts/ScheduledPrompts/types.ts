
export interface ScheduledPrompt {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  scheduledDate: Date;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
}

export interface NewPromptForm {
  title: string;
  prompt: string;
  platform: string;
  scheduledDate: string;
  scheduledTime: string;
}


