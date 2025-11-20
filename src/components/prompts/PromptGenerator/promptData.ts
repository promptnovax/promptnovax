
export const promptTypes = [
  { value: "app-development", label: "App Development", desc: "Build apps with React, Next.js, Lovable.dev", icon: "💻" },
  { value: "content-writing", label: "Content Writing", desc: "Blogs, articles, social media posts", icon: "✍️" },
  { value: "marketing", label: "Marketing & SEO", desc: "Ad copy, email campaigns, SEO strategy", icon: "📈" },
  { value: "design", label: "UI/UX Design", desc: "Interfaces, logos, brand guidelines", icon: "🎨" },
  { value: "coding", label: "Programming", desc: "Scripts, functions, debugging help", icon: "⚡" },
  { value: "data-analysis", label: "Data Analysis", desc: "Python, Excel, SQL queries", icon: "📊" },
  { value: "automation", label: "Automation", desc: "Workflows, scripts, chatbots", icon: "🤖" },
  { value: "creative", label: "Creative Content", desc: "Stories, images, video scripts", icon: "🎭" },
  { value: "video-generation", label: "Video Generation", desc: "Sora, Runway, video prompts", icon: "🎬" },
  { value: "image-generation", label: "Image Generation", desc: "Midjourney, DALL·E, Leonardo", icon: "🖼️" }
];

export type AiPlatformCategory = "text" | "image" | "video" | "development" | "research" | "general";

export interface AiPlatformMeta {
  value: string;
  label: string;
  category: AiPlatformCategory | string;
  launchUrl?: string;
  launchLabel?: string;
  launchHelper?: string;
}

export const aiPlatforms: AiPlatformMeta[] = [
  { 
    value: "chatgpt", 
    label: "ChatGPT / GPT-4", 
    category: "text",
    launchUrl: "https://chatgpt.com/",
    launchLabel: "Open in ChatGPT",
    launchHelper: "We\u2019ll copy the prompt and open chatgpt.com in a new tab."
  },
  { 
    value: "claude", 
    label: "Claude (Anthropic)", 
    category: "text",
    launchUrl: "https://claude.ai/new",
    launchLabel: "Send to Claude",
    launchHelper: "Opens claude.ai/new with your prompt on the clipboard."
  },
  { 
    value: "gemini", 
    label: "Google Gemini", 
    category: "text",
    launchUrl: "https://gemini.google.com/app",
    launchLabel: "Open Gemini",
    launchHelper: "Open Gemini and paste the copied prompt to start chatting."
  },
  { 
    value: "lovable", 
    label: "Lovable.dev", 
    category: "development",
    launchUrl: "https://lovable-dev.web.app/app",
    launchLabel: "Launch Lovable.dev",
    launchHelper: "Paste the copied brief directly into Lovable.dev."
  },
  { 
    value: "midjourney", 
    label: "MidJourney", 
    category: "image",
    launchUrl: "https://www.midjourney.com/imagine",
    launchLabel: "Copy for Midjourney",
    launchHelper: "Prompt is copied so you can paste it inside Discord."
  },
  { 
    value: "dalle", 
    label: "DALL\u00b7E", 
    category: "image",
    launchUrl: "https://labs.openai.com/",
    launchLabel: "Open DALL\u00b7E",
    launchHelper: "Opens labs.openai.com in a new tab."
  },
  { 
    value: "leonardo", 
    label: "Leonardo AI", 
    category: "image",
    launchUrl: "https://app.leonardo.ai/ai-generations",
    launchLabel: "Launch Leonardo AI",
    launchHelper: "Copies the prompt and jumps to your Leonardo workspace."
  },
  { 
    value: "sora", 
    label: "Sora (OpenAI)", 
    category: "video",
    launchUrl: "https://openai.com/sora",
    launchLabel: "Open Sora Updates",
    launchHelper: "Sora is limited access \u2013 we\u2019ll send you to the official page."
  },
  { 
    value: "runway", 
    label: "Runway ML", 
    category: "video",
    launchUrl: "https://app.runwayml.com/",
    launchLabel: "Launch Runway",
    launchHelper: "Copies your story prompt and opens Runway\u2019s workspace."
  },
  { 
    value: "copilot", 
    label: "GitHub Copilot", 
    category: "development",
    launchUrl: "https://github.com/features/copilot",
    launchLabel: "Use with Copilot",
    launchHelper: "Paste the instructions into your IDE while Copilot listens."
  },
  { 
    value: "perplexity", 
    label: "Perplexity AI", 
    category: "research",
    launchUrl: "https://www.perplexity.ai/",
    launchLabel: "Ask Perplexity",
    launchHelper: "Opens Perplexity with the prompt ready on your clipboard."
  },
  { 
    value: "universal", 
    label: "Universal (Any AI)", 
    category: "general",
    launchUrl: "https://www.futurepedia.io/",
    launchLabel: "Copy for Any Platform",
    launchHelper: "Select any AI platform after we copy the prompt for you."
  }
];

export const outputFormats = [
  { value: "casual", label: "Casual", desc: "Conversational and friendly" },
  { value: "professional", label: "Professional", desc: "Structured and formal" },
  { value: "detailed", label: "Detailed", desc: "Comprehensive instructions" },
  { value: "role-based", label: "Role-Based", desc: "Act as an expert persona" },
  { value: "json", label: "JSON Format", desc: "Structured data format", premium: false },
  { value: "markdown", label: "Markdown", desc: "Formatted documentation", premium: false },
  { value: "code-ready", label: "Code-Ready", desc: "Development-optimized", premium: false }
];

export const languages = [
  { value: "english", label: "English" },
  { value: "urdu", label: "اردو (Urdu)" },
  { value: "hindi", label: "हिंदी (Hindi)" },
  { value: "arabic", label: "العربية (Arabic)" },
  { value: "spanish", label: "Español" },
  { value: "french", label: "Français" },
  { value: "german", label: "Deutsch" },
  { value: "chinese", label: "中文 (Chinese)" }
];


