
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScheduledPrompt, NewPromptForm } from "./types";

export const useScheduledPrompts = () => {
  const [scheduledPrompts, setScheduledPrompts] = useState<ScheduledPrompt[]>([]);
  const [newPrompt, setNewPrompt] = useState<NewPromptForm>({
    title: '',
    prompt: '',
    platform: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  useEffect(() => {
    // Load scheduled prompts from localStorage
    const saved = localStorage.getItem('scheduled-prompts');
    if (saved) {
      const parsedPrompts = JSON.parse(saved);
      // Convert date strings back to Date objects
      const promptsWithDates = parsedPrompts.map((prompt: any) => ({
        ...prompt,
        scheduledDate: new Date(prompt.scheduledDate),
        createdAt: new Date(prompt.createdAt)
      }));
      setScheduledPrompts(promptsWithDates);
    }
  }, []);

  const saveScheduledPrompts = (prompts: ScheduledPrompt[]) => {
    setScheduledPrompts(prompts);
    localStorage.setItem('scheduled-prompts', JSON.stringify(prompts));
  };

  const createScheduledPrompt = () => {
    if (!newPrompt.title || !newPrompt.prompt || !newPrompt.platform || !newPrompt.scheduledDate || !newPrompt.scheduledTime) {
      toast.error("Please fill in all fields");
      return false;
    }

    const scheduledDateTime = new Date(`${newPrompt.scheduledDate}T${newPrompt.scheduledTime}`);
    
    if (scheduledDateTime <= new Date()) {
      toast.error("Scheduled time must be in the future");
      return false;
    }

    const scheduled: ScheduledPrompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      prompt: newPrompt.prompt,
      platform: newPrompt.platform,
      scheduledDate: scheduledDateTime,
      status: 'pending',
      createdAt: new Date()
    };

    const updated = [...scheduledPrompts, scheduled];
    saveScheduledPrompts(updated);
    
    setNewPrompt({
      title: '',
      prompt: '',
      platform: '',
      scheduledDate: '',
      scheduledTime: ''
    });
    
    toast.success("Prompt scheduled successfully!");
    return true;
  };

  const deleteScheduledPrompt = (id: string) => {
    const updated = scheduledPrompts.filter(p => p.id !== id);
    saveScheduledPrompts(updated);
    toast.success("Scheduled prompt deleted");
  };

  const sendNow = (id: string) => {
    const updated = scheduledPrompts.map(p => 
      p.id === id ? { ...p, status: 'sent' as const } : p
    );
    saveScheduledPrompts(updated);
    toast.success("Prompt sent!");
  };

  return {
    scheduledPrompts,
    newPrompt,
    setNewPrompt,
    createScheduledPrompt,
    deleteScheduledPrompt,
    sendNow
  };
};


