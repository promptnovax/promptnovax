import type { PromptGeneratorPayload, PromptGeneratorResponse } from "@/lib/promptGeneratorTypes"
import { aiPlatforms } from "@/components/prompts/PromptGenerator/promptData"

const promptTypeGuidance: Record<string, string> = {
  "app-development": "Detail architecture choices, APIs, testing, and deployment notes for engineers.",
  "content-writing": "Outline tone, audience, SEO keywords, hooks, and formatting expectations.",
  marketing: "Highlight campaign objectives, channels, CTAs, audiences, and performance metrics.",
  design: "Describe layout, typography, accessibility, and hand-off artifacts.",
  coding: "Request precise code snippets, edge cases, and validation steps.",
  "data-analysis": "Include dataset assumptions, analytical methods, visuals, and decision criteria.",
  automation: "Spell out triggers, steps, guardrails, and monitoring.",
  creative: "Encourage storytelling beats, mood, pacing, and originality.",
  "video-generation": "Break down scenes, camera cues, motion, and render specs.",
  "image-generation": "Cover subject, composition, lighting, style, and negative prompts."
}

const outputFormatGuidance: Record<string, string> = {
  casual: "Use a friendly voice with short paragraphs and emojis sparingly.",
  professional: "Write in a structured tone with numbered sections and clear headings.",
  detailed: "Provide exhaustive directions, sub-sections, and explicit acceptance criteria.",
  "role-based": "Start with “You are …” persona framing followed by responsibilities.",
  json: "Return JSON with keys persona, context, instructions, quality_checks, follow_ups.",
  markdown: "Use Markdown headings, bullet lists, and code fences when useful.",
  "code-ready": "Lead with code comments, commands, and inline explanations."
}

const languageLabels: Record<string, string> = {
  english: "English",
  urdu: "Urdu",
  hindi: "Hindi",
  arabic: "Arabic",
  spanish: "Spanish",
  french: "French",
  german: "German",
  chinese: "Chinese"
}

const platformVoices: Record<string, string> = {
  chatgpt: "Act like OpenAI ChatGPT/GPT-4 with precise system -> user framing.",
  claude: "Follow Anthropic Claude constitutional style with balanced reasoning.",
  gemini: "Use Google Gemini multi-modal friendly tone with explicit references.",
  lovable: "Behave like Lovable.dev copilot that scaffolds full-stack projects fast.",
  midjourney: "Speak in Midjourney v6 syntax with stylize and aspect ratios.",
  dalle: "Deliver crisp DALL·E prompts emphasizing composition and details.",
  leonardo: "Craft art-director instructions optimized for Leonardo AI.",
  sora: "Write cinematic video prompts for Sora including motion + timing notes.",
  runway: "Structure Runway shots with numbered beats and effects.",
  copilot: "Provide GitHub Copilot guidance with inline code instructions.",
  perplexity: "Use retrieval-friendly phrasing and cite references for Perplexity.",
  universal: "Be platform agnostic but insist on explicit structure."
}

const qualityChecklistByCategory: Record<string, string[]> = {
  image: [
    "Composition covers subject, environment, lighting, and camera lens.",
    "Includes style keywords plus negative cues for banned artifacts.",
    "Specifies aspect ratio and render quality."
  ],
  video: [
    "Scenes are broken into beats with timing and transitions.",
    "Motion cues, camera movement, and lighting described clearly.",
    "Output references duration, resolution, and format."
  ],
  development: [
    "Includes stack, environments, and dependency notes.",
    "Lists validation, testing, and monitoring expectations.",
    "Calls out security, performance, and rollout safeguards."
  ],
  default: [
    "Prompt states persona, context, and success metrics.",
    "Lists numbered instructions and expected deliverables.",
    "Adds edge cases plus follow-up questions."
  ]
}

const followUpPrompts: Record<string, string[]> = {
  text: [
    "Ask the AI to provide 3 alternate tones or voices.",
    "Request a shorter TL;DR version for busy stakeholders."
  ],
  image: [
    "Explore alternate color palettes or camera lenses.",
    "Vary mood (dawn, dusk, neon, film noir) to compare outputs."
  ],
  video: [
    "Generate alternate shot pacing for social vs. cinematic cuts.",
    "Swap camera rigs (handheld vs. drone) to test dynamics."
  ],
  development: [
    "Request code snippets for the most critical modules.",
    "Ask for test cases or observability hooks."
  ],
  general: [
    "Brainstorm follow-up questions to refine the prompt.",
    "Request examples, datasets, or personas that strengthen outputs."
  ]
}

const categoryAliases: Record<string, keyof typeof followUpPrompts> = {
  text: "text",
  general: "general",
  research: "text",
  image: "image",
  video: "video",
  development: "development"
}

const ENABLE_DEBUG = false

const estimatePromptScore = (prompt: string) => {
  if (!prompt) return 70
  const lengthScore = Math.min(40, Math.floor(prompt.length / 40))
  const sectionBonus = (prompt.match(/## /g) || []).length * 3
  const checklistBonus = prompt.includes("- [ ]") ? 10 : 0
  return Math.max(72, Math.min(100, 62 + lengthScore + sectionBonus + checklistBonus))
}

const buildNumberedList = (items: string[]) =>
  items
    .filter(Boolean)
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n")

const buildChecklist = (items: string[]) =>
  items
    .filter(Boolean)
    .map(item => `- [ ] ${item}`)
    .join("\n")

const sanitize = (text?: string) => (text?.trim() ? text.trim() : undefined)

export const synthesizeLocalPrompt = (
  payload: PromptGeneratorPayload,
  error?: Error
): PromptGeneratorResponse => {
  const {
    userInput,
    promptType,
    aiPlatform,
    outputFormat,
    language,
    visualReference,
    referenceType,
    mode,
    existingPrompt
  } = payload

  const platformMeta = aiPlatforms.find(p => p.value === aiPlatform)
  const platformLabel = platformMeta?.label || aiPlatform || "Universal AI model"
  const category = platformMeta?.category || "general"
  const languageLabel = languageLabels[language] || languageLabels.english

  const personaLine =
    platformVoices[aiPlatform] ||
    `Behave like a senior ${platformLabel} prompt engineer who ships production-ready instructions.`

  const typeGuidance =
    promptTypeGuidance[promptType] || "Deliver a structured, high-impact prompt with measurable outcomes."

  const formatGuidance =
    outputFormatGuidance[outputFormat] || "Return the answer using Markdown headings and bullet lists."

  const referenceLine = sanitize(visualReference)
    ? `Reference material (${referenceType || "general"}): ${visualReference!.trim()}`
    : "Reference material: none provided. Ask clarifying questions if visuals are required."

  const enhancementBlock =
    mode === "enhance" && existingPrompt
      ? `Existing prompt to improve:\n"""\n${existingPrompt.trim()}\n"""\nTighten structure, remove redundancies, keep critical facts.\n`
      : ""

  const instructionFlow = buildNumberedList([
    `Frame the assistant as ${platformLabel} tuned for the "${promptType}" scenario.`,
    `Summarize the mission in ${languageLabel}: ${userInput.trim()}`,
    `Lay out granular steps that follow ${typeGuidance.toLowerCase()}`,
    `Embed formatting guidance: ${formatGuidance}`,
    sanitize(visualReference)
      ? "Incorporate the supplied reference faithfully and note any missing info."
      : "Request clarifications when information or assets feel incomplete.",
    "Finish with success metrics, risks, and recommended follow-up prompts."
  ])

  const checklist =
    qualityChecklistByCategory[category as keyof typeof qualityChecklistByCategory] ||
    qualityChecklistByCategory.default

  const followUpKey = categoryAliases[category as keyof typeof categoryAliases] || "general"
  const followUps = followUpPrompts[followUpKey] || followUpPrompts.general

  const promptBody = [
    `## Persona & Mission\n${personaLine}\n\nOperate in ${languageLabel} (mirroring user language if different) and keep tone ${outputFormat} by default.`,
    `## Context & Goal\nPrimary objective:\n"""${userInput.trim()}"""\n\n${referenceLine}`,
    enhancementBlock && `## What to Improve\n${enhancementBlock.trim()}`,
    `## Instruction Flow\n${instructionFlow}`,
    `## Output Format Rules\n${formatGuidance}\n- Always mention platform specifics for ${platformLabel}.\n- Provide sections: Persona, Context, Steps, Quality, Follow-ups.`,
    `## Quality Checklist\n${buildChecklist(checklist)}`,
    `## Follow-up Ideas\n${buildNumberedList(followUps)}`
  ]
    .filter(Boolean)
    .join("\n\n")

  if (ENABLE_DEBUG && error) {
    console.warn("[PromptNX] Falling back to local prompt synthesis:", error)
  }

  return {
    success: true,
    prompt: promptBody,
    score: estimatePromptScore(promptBody),
    metadata: {
      provider: "promptnx-local",
      model: "offline-synthesizer-v1",
      mode,
      fallback: true,
      reason: error?.message,
      category
    }
  }
}


