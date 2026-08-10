import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/** Provider del AI Gateway de Lovable (server-only). */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}
