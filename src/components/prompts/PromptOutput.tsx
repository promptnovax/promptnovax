
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Download,
  Share,
  Heart,
  ExternalLink,
  Undo2,
  PenLine,
  MessageSquare,
  Palette,
  Video,
  Bot,
  Globe
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { aiPlatforms, type AiPlatformMeta } from "@/components/prompts/PromptGenerator/promptData";

interface PromptOutputProps {
  prompt: string;
  score: number | null;
  platform?: AiPlatformMeta;
  onCopy: () => void;
  onDownload: () => void;
  onPromptChange?: (value: string) => void;
  hasEdits?: boolean;
  onResetEdits?: () => void;
}

type PlatformShortcut = {
  value: string;
  label: string;
  url: string;
  description: string;
  icon: LucideIcon;
};

const categoryIconMap: Record<string, LucideIcon> = {
  text: MessageSquare,
  development: Bot,
  image: Palette,
  video: Video,
  research: Globe,
  general: Globe,
};

const fallbackShortcut: PlatformShortcut = {
  value: "universal",
  label: "Open AI Platform",
  url: "https://www.perplexity.ai/",
  description: "We copy your prompt and open a new tab so you can paste instantly.",
  icon: Globe,
};

const getShortcutFromPlatform = (platform?: AiPlatformMeta): PlatformShortcut => {
  if (!platform) return fallbackShortcut;

  return {
    value: platform.value,
    label: platform.launchLabel || `Open ${platform.label}`,
    url: platform.launchUrl || fallbackShortcut.url,
    description: platform.launchHelper || fallbackShortcut.description,
    icon: categoryIconMap[platform.category] || Globe,
  };
};

export const PromptOutput = ({
  prompt,
  score,
  platform,
  onCopy,
  onDownload,
  onPromptChange,
  hasEdits,
  onResetEdits
}: PromptOutputProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const copyToClipboard = async (text = prompt) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard is unavailable in this environment.");
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
      return true;
    } catch (error) {
      console.warn("Clipboard copy failed", error);
      toast.error("Copy failed. Please copy manually.");
      return false;
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload();
  };

  const sharePrompt = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Generated AI Prompt",
          text: prompt,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await copyToClipboard();
    }
  };

  const launchShortcut = async (shortcut: PlatformShortcut) => {
    if (!prompt.trim()) {
      toast.info("Generate a prompt first.");
      return;
    }

    const copied = await copyToClipboard();

    if (typeof window === "undefined") {
      toast.info("Open the platform manually and paste your prompt.");
      return;
    }

    if (!copied && !shortcut.url) {
      return;
    }

    const newWindow = window.open(shortcut.url, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      toast.error("Popup blocked. Allow popups for this site and try again.");
      return;
    }

    toast.success(`Prompt copied! Paste it inside ${shortcut.label.replace("Open ", "")}.`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (score >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    return "Needs Improvement";
  };

  const primaryShortcut = useMemo(() => getShortcutFromPlatform(platform), [platform]);

  const companionShortcuts = useMemo(() => {
    if (!platform) return [];
    return aiPlatformCompanions(platform.value, platform.category).map(getShortcutFromPlatform);
  }, [platform]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex flex-wrap items-center gap-2">
              <span>Generated Prompt</span>
              {score && (
                <Badge className={getScoreColor(score)}>
                  {score}/100 - {getScoreLabel(score)}
                </Badge>
              )}
              {onPromptChange && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <PenLine className="h-3 w-3" />
                  Live editable
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Ready to launch into{" "}
              {platform?.label || "your favorite AI platform"}.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className={isFavorited ? "text-red-500" : "text-gray-400"}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Prompt Display */}
        <div className="space-y-2">
          {onPromptChange && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <PenLine className="h-3 w-3" />
                {hasEdits ? "Edited \u2013 not synced yet" : "Tweak anything before sending"}
              </span>
              {hasEdits && onResetEdits && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onResetEdits}
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          )}
          <Textarea
            value={prompt}
            readOnly={!onPromptChange}
            onChange={(e) => onPromptChange?.(e.target.value)}
            className="min-h-[320px] font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => copyToClipboard()} className="flex-1 min-w-[120px]">
            <Copy className="h-4 w-4 mr-2" />
            Copy Prompt
          </Button>
          <Button onClick={downloadPrompt} variant="outline" className="flex-1 min-w-[120px]">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={sharePrompt} variant="outline" className="flex-1 min-w-[120px]">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Platform Launch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Launch on your platform</h4>
            {platform && (
              <Badge variant="outline" className="text-xs">
                {platform.label}
              </Badge>
            )}
          </div>
          <Button
            onClick={() => launchShortcut(primaryShortcut)}
            className="w-full justify-between"
            disabled={!prompt}
          >
            <span className="flex items-center gap-2">
              <primaryShortcut.icon className="h-4 w-4" />
              {primaryShortcut.label}
            </span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            We copy the prompt automatically and open {primaryShortcut.label} in a new tab.
          </p>
          {companionShortcuts.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {companionShortcuts.map((shortcut) => (
                <Button
                  key={shortcut.value}
                  variant="outline"
                  size="sm"
                  className="justify-between"
                  onClick={() => launchShortcut(shortcut)}
                  disabled={!prompt}
                >
                  <span className="flex items-center gap-2 text-xs">
                    <shortcut.icon className="h-3 w-3" />
                    {shortcut.label.replace("Open ", "")}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Copy Helpers */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Quick Copy</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const sections = prompt.split("\n\n");
                copyToClipboard(sections[0] || "");
              }}
            >
              Copy Header Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const mainContent = prompt.replace(/\*\*(.*?)\*\*/g, "$1");
                copyToClipboard(mainContent);
              }}
            >
              Copy Plain Text
            </Button>
          </div>
        </div>

        {/* Prompt Tips */}
        {score && score < 85 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-sm text-yellow-800 dark:text-yellow-200 mb-1">
              💡 Tips to Improve Your Prompt:
            </h4>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Be more specific about your requirements</li>
              <li>• Add examples of desired output</li>
              <li>• Include context about your target audience</li>
              <li>• Specify the format you want (steps, bullet points, etc.)</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const aiPlatformCompanions = (value: string, category: string) => {
  const preferredOrder = ["chatgpt", "claude", "gemini", "perplexity", "copilot", "midjourney", "dalle", "universal"];
  const inCategory = aiPlatforms.filter((platform) => platform.category === category && platform.value !== value);

  const prioritized = preferredOrder
    .map((platformValue) => aiPlatforms.find((platform) => platform.value === platformValue))
    .filter((platform): platform is AiPlatformMeta => Boolean(platform));

  const combined: AiPlatformMeta[] = [];

  [...inCategory, ...prioritized].forEach((platform) => {
    if (platform.value === value) return;
    if (!combined.find((entry) => entry.value === platform.value)) {
      combined.push(platform);
    }
  });

  return combined.slice(0, 2);
};


