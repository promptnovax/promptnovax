import { PromptGenerator } from "@/components/prompts/PromptGenerator";

export function PromptGeneratorPage() {
  const handleBack = () => {
    window.location.hash = "#home";
  };

  return <PromptGenerator onBack={handleBack} />;
}


