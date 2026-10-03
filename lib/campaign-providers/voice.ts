import type {
  CampaignMessageInput,
  CampaignProvider,
  ProviderResult,
} from "./types";

export class VoiceProvider implements CampaignProvider {
  readonly channel = "VOICE" as const;

  async send(
    _input: CampaignMessageInput
  ): Promise<ProviderResult> {
    throw new Error(
      "LIVE VOICE provider is not configured yet."
    );
  }
}
