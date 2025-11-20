import type { PromptGeneratorPayload, PromptGeneratorResponse } from "@/lib/promptGeneratorTypes"
import { synthesizeLocalPrompt } from "@/lib/localPromptSynthesis"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8787"
const ENABLE_LOCAL_FALLBACK =
  (import.meta.env.VITE_ENABLE_LOCAL_PROMPT_FALLBACK ?? "true").toString().toLowerCase() !== "false"

const fallbackOrThrow = (
  payload: PromptGeneratorPayload,
  error: unknown
): PromptGeneratorResponse => {
  if (!ENABLE_LOCAL_FALLBACK) {
    throw error instanceof Error ? error : new Error("Prompt generation failed")
  }

  return synthesizeLocalPrompt(payload, error instanceof Error ? error : undefined)
}

export async function requestPromptGeneration(
  payload: PromptGeneratorPayload
): Promise<PromptGeneratorResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/prompt-generator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    let data: PromptGeneratorResponse | null = null
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error("Invalid response from prompt service")
    }

    if (!response.ok || !data?.success) {
      const apiError = new Error((data as any)?.error || "Failed to generate prompt")
      return fallbackOrThrow(payload, apiError)
    }

    return data
  } catch (error) {
    return fallbackOrThrow(payload, error)
  }
}

export type { PromptGeneratorPayload, PromptGeneratorResponse }

