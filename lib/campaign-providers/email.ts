import type {
  CampaignMessageInput,
  CampaignProvider,
  ProviderResult,
} from "./types";

export class EmailProvider implements CampaignProvider {
  readonly channel = "EMAIL" as const;

  async send(
    _input: CampaignMessageInput
  ): Promise<ProviderResult> {
    throw new Error(
      "LIVE EMAIL provider is not configured yet."
    );
  }
}
