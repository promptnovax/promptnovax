type PromptGeneratorMode = 'generate' | 'enhance'

interface LocalPromptOptions {
  userInput: string
  promptType: string
  aiPlatform: string
  outputFormat: string
  language: string
  visualReference?: string
  referenceType?: string
  mode?: PromptGeneratorMode
  existingPrompt?: string
}

const promptTypeGuidance: Record<string, string> = {
  'app-development': 'Explain architecture, APIs, testing, and rollout steps.',
  'content-writing': 'Call out audience, tone, SEO keywords, and CTAs.',
  marketing: 'Include campaign goals, channels, messaging pillars, and KPIs.',
  design: 'Describe layout, typography, color palette, and accessibility needs.',
  coding: 'Request concrete code snippets with edge cases and validation.',
  'data-analysis': 'List dataset assumptions, analytical techniques, and visualization cue.',
  automation: 'Detail triggers, integrations, guardrails, and monitoring.',
  creative: 'Encourage narrative beats, pacing, and originality.',
  'video-generation': 'Outline scenes, camera motion, timing, and render specs.',
  'image-generation': 'Cover subject, composition, lighting, style, and negative prompts.'
}

const outputFormatGuidance: Record<string, string> = {
  casual: 'Use a friendly voice with short paragraphs.',
  professional: 'Keep a structured tone with numbered sections.',
  detailed: 'Provide exhaustive instructions with sub-sections.',
  'role-based': 'Begin with "You are..." persona framing then directives.',
  json: 'Return JSON with persona, context, instructions, quality_checks, follow_ups.',
  markdown: 'Use Markdown headings, bullets, and code fences when relevant.',
  'code-ready': 'Focus on commands, code snippets, and inline comments.'
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

const platformHints: Record<string, { label: string; description: string; category: string }> = {
  chatgpt: { label: 'ChatGPT / GPT-4', description: 'System + user style with precise role instructions.', category: 'text' },
  claude: { label: 'Claude (Anthropic)', description: 'Constitutional style, emphasize safety guardrails.', category: 'text' },
  gemini: { label: 'Google Gemini', description: 'Multimodal aware with references and reasoning.', category: 'text' },
  lovable: { label: 'Lovable.dev', description: 'Full-stack scaffolding + roadmap cues.', category: 'development' },
  midjourney: { label: 'Midjourney', description: 'v6 syntax, stylize, aspect ratios.', category: 'image' },
  dalle: { label: 'DALL·E', description: 'Composition, camera, and styling keywords.', category: 'image' },
  leonardo: { label: 'Leonardo AI', description: 'Art direction with fine-grained controls.', category: 'image' },
  sora: { label: 'Sora', description: 'Cinematic shots with motion + pacing.', category: 'video' },
  runway: { label: 'Runway', description: 'Storyboard beats with transitions.', category: 'video' },
  copilot: { label: 'GitHub Copilot', description: 'Inline code + expected behavior.', category: 'development' },
  perplexity: { label: 'Perplexity AI', description: 'Retrieval cues and citation instructions.', category: 'text' },
  universal: { label: 'Universal AI', description: 'Platform agnostic with explicit structure.', category: 'general' }
}

const qualityChecklist: Record<string, string[]> = {
  image: [
    'Subject, environment, and lighting are explicit.',
    'Style keywords + negative prompts included.',
    'Resolution / aspect ratio defined.'
  ],
  video: [
    'Scenes broken into beats with timing.',
    'Camera motion + lighting cues described.',
    'Output duration / format noted.'
  ],
  development: [
    'Tech stack, dependencies, and environments listed.',
    'Testing, validation, and monitoring captured.',
    'Security & rollout safeguards included.'
  ],
  default: [
    'Persona + objective clearly defined.',
    'Numbered steps with success metrics.',
    'Edge cases and follow-up prompts provided.'
  ]
}

const followUps: Record<string, string[]> = {
  text: [
    'Ask for three alternate tones or voices.',
    'Request a TL;DR executive summary.',
    'Generate probing questions to refine requirements.'
  ],
  image: [
    'Explore alternate art styles or lighting setups.',
    'Vary camera lenses or aspect ratios.',
    'Generate mood board variations.'
  ],
  video: [
    'Try faster pacing for social shorts.',
    'Swap camera rigs (handheld vs drone).',
    'Request shot-by-shot annotations.'
  ],
  development: [
    'Ask for code snippets of the critical module.',
    'Request integration tests or monitoring hooks.'
  ],
  general: [
    'Brainstorm risks and mitigations.',
    'Identify datasets or references to include.'
  ]
}

const estimateScore = (prompt: string) => {
  if (!prompt) return 72
  const lengthScore = Math.min(40, Math.floor(prompt.length / 50))
  const headingBonus = (prompt.match(/## /g) || []).length * 3
  const checklistBonus = prompt.includes('- [ ]') ? 8 : 0
  return Math.max(72, Math.min(100, 62 + lengthScore + headingBonus + checklistBonus))
}

const buildNumbered = (items: string[]) =>
  items.filter(Boolean).map((item, idx) => `${idx + 1}. ${item}`).join('\n')

const buildChecklist = (items: string[]) => items.filter(Boolean).map(item => `- [ ] ${item}`).join('\n')

export function synthesizeLocalPrompt(options: LocalPromptOptions, reason?: string) {
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
  } = options

  const platform = platformHints[aiPlatform] || {
    label: aiPlatform || 'Universal AI',
    description: 'Apply best practices for any LLM.',
    category: 'general'
  }
  const languageLabel = languageLabels[language] || languageLabels.english
  const typeHint = promptTypeGuidance[promptType] || promptTypeGuidance['creative']
  const outputHint = outputFormatGuidance[outputFormat] || outputFormatGuidance.markdown

  const referenceLine = visualReference?.trim()
    ? `Reference material (${referenceType || 'general'}): ${visualReference.trim()}`
    : 'Reference material: none provided. Ask follow-up questions if unclear.'

  const enhancementSection =
    mode === 'enhance' && existingPrompt
      ? `## What to Improve
"""
${existingPrompt.trim()}
"""

Tighten structure, remove redundancies, and keep all critical facts intact.
`
      : ''

  const checklist = qualityChecklist[platform.category as keyof typeof qualityChecklist] || qualityChecklist.default
  const followUpSet =
    followUps[platform.category as keyof typeof followUps] ||
    followUps[(platform.category === 'general' ? 'general' : 'text') as keyof typeof followUps]

  const promptBody = [
    `## Persona & Mission
Act as ${platform.label}. ${platform.description}
Respond in ${languageLabel} and keep tone ${outputFormat}.`,
    `## Context & Goal
Objective:
"""${userInput.trim()}"""

${referenceLine}`,
    enhancementSection.trim(),
    `## Instruction Flow
${buildNumbered([
  `State the assistant persona optimized for ${platform.label}.`,
  `Summarize the primary mission referencing the user's wording.`,
  `Lay out detailed steps following: ${typeHint}`,
  `Embed formatting guidance: ${outputHint}`,
  visualReference?.trim()
    ? 'Weave in the provided reference and call out missing details.'
    : 'List clarifying questions when data feels incomplete.',
  'Close with success metrics, risks, and next best actions.'
])}`,
    `## Quality Checklist
${buildChecklist(checklist)}`,
    `## Follow-up Ideas
${buildNumbered(followUpSet)}`
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    success: true,
    prompt: promptBody,
    score: estimateScore(promptBody),
    metadata: {
      provider: 'promptnx-local',
      model: 'offline-synthesizer-v1',
      mode,
      fallback: true,
      reason
    }
  }
}


