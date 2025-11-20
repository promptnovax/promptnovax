interface PromptGeneratorConfig {
  userInput: string
  promptType: string
  aiPlatform: string
  outputFormat: string
  language: string
  visualReference?: string
  referenceType?: string
  mode?: 'generate' | 'enhance'
  existingPrompt?: string
}

const promptTypeGuidance: Record<string, string> = {
  'app-development': 'Focus on full-stack web/mobile app instructions, include architecture, tech stack, and delivery milestones.',
  'content-writing': 'Emphasize tone of voice, audience targeting, SEO keywords, and formatting for long-form content.',
  marketing: 'Highlight campaign objectives, channels, audience personas, CTAs, and performance metrics.',
  design: 'Describe visual aesthetics, layout rules, color/typography systems, accessibility, and hand-off expectations.',
  coding: 'Request precise coding steps, best practices, edge cases, and testing guidance.',
  'data-analysis': 'Include dataset context, analytical goals, statistical methods, visualization expectations, and reporting cadence.',
  automation: 'Detail workflow triggers, integrations, guardrails, and monitoring steps.',
  creative: 'Encourage storytelling structure, mood boards, pacing, and originality checks.',
  'video-generation': 'Break down scenes, camera cues, shot timing, motion, lighting, and render specs.',
  'image-generation': 'Specify composition, subject, lighting, color palette, art style, and negative prompts.'
}

const outputFormatGuidance: Record<string, string> = {
  casual: 'Write in a friendly conversational tone with concise paragraphs.',
  professional: 'Use formal, structured language with numbered sections.',
  detailed: 'Provide exhaustive detail, subsections, and explicit acceptance criteria.',
  'role-based': 'Begin with "You are..." persona framing before listing directives.',
  json: 'Return the final prompt as valid JSON with keys: persona, context, instructions, quality_checks.',
  markdown: 'Use Markdown headings, bullet lists, and code fences where relevant.',
  'code-ready': 'Prioritize code snippets, inline comments, and precise implementation commands.'
}

const languageLabels: Record<string, string> = {
  english: 'English',
  urdu: 'Urdu',
  hindi: 'Hindi',
  arabic: 'Arabic',
  spanish: 'Spanish',
  french: 'French',
  german: 'German',
  chinese: 'Chinese'
}

const aiPlatformHints: Record<string, string> = {
  chatgpt: 'Optimize for OpenAI ChatGPT/GPT-4 with clear role + instructions.',
  claude: 'Optimize for Anthropic Claude with constitutional guardrails and context blocks.',
  gemini: 'Optimize for Google Gemini with multi-modal cues and reasoning steps.',
  lovable: 'Target Lovable.dev for app blueprints and code scaffolding.',
  midjourney: 'Write Midjourney v6 prompts with stylization and aspect ratio commands.',
  dalle: 'Target DALL·E image prompts emphasizing composition + style keywords.',
  leonardo: 'Adapt for Leonardo AI with fine-grained art direction.',
  sora: 'Create cinematic Sora prompts covering motion, scene, and pacing.',
  runway: 'Optimize for Runway with storyboard-like directions.',
  copilot: 'Provide GitHub Copilot instructions with inline code expectations.',
  perplexity: 'Include retrieval instructions and citation requirements.',
  universal: 'Make the prompt platform-agnostic with explicit formatting requirements.'
}

export function buildPromptBlueprint(config: PromptGeneratorConfig): string {
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
  } = config

  const typeGuidance = promptTypeGuidance[promptType] || 'Deliver a high-quality, multi-step AI prompt.'
  const formatGuidance = outputFormatGuidance[outputFormat] || 'Return structured bullet lists with clear sections.'
  const platformHint = aiPlatformHints[aiPlatform] || 'Ensure the prompt works on any modern LLM.'
  const languageLabel = languageLabels[language] || 'English'

  const referenceLine =
    visualReference && visualReference.trim().length > 0
      ? `Reference Material (${referenceType ?? 'general'}): ${visualReference.trim()}`
      : 'Reference Material: None provided.'

  const enhancementBlock =
    mode === 'enhance' && existingPrompt
      ? `
Existing Prompt To Improve:
"""
${existingPrompt.trim()}
"""

Rewrite, clean up redundancies, add missing structure, and keep all mission-critical facts.
`
      : ''

  return `You are PromptNX's senior prompt engineer. Craft a ready-to-use prompt for the user story below.

Category Focus: ${promptType}
Platform Target: ${aiPlatform}
Preferred Output Format: ${outputFormat}
Language: ${languageLabel}

Primary Goal:
${userInput.trim()}

${referenceLine}

Guidance:
- ${typeGuidance}
- ${platformHint}
- ${formatGuidance}
- Always include success metrics, edge cases, and follow-up suggestions.
- Respond in ${languageLabel}. If the user content uses another language, mirror it but keep headings bilingual if possible.

Deliverable:
1. Title + persona line.
2. Context + constraints block.
3. Step-by-step instructions with numbering.
4. Quality checklist / evaluation rubric.
5. Optional advanced tips or extensions.
6. If visual/video prompt, add technical parameters (aspect ratio, camera, lighting, etc.).

${enhancementBlock}
Return only the improved prompt (no commentary).`
}

export function estimatePromptScore(prompt: string): number {
  if (!prompt) return 70
  const lengthScore = Math.min(40, Math.floor(prompt.length / 40))
  const sectionBonus = (prompt.match(/\n\n/g) || []).length * 2
  const checklistBonus = prompt.includes('-') ? 8 : 0
  const finalScore = 60 + lengthScore + sectionBonus + checklistBonus
  return Math.max(70, Math.min(100, finalScore))
}

export type { PromptGeneratorConfig }


