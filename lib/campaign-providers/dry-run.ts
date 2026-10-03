import type {
  CampaignMessageInput,
  CampaignProvider,
  ProviderResult,
} from "./types";

export class DryRunProvider implements CampaignProvider {
  constructor(
    public readonly channel: CampaignMessageInput["channel"]
  ) {}

  async send(
    _input: CampaignMessageInput
  ): Promise<ProviderResult> {
    return {
      success: true,
      mode: "DRY_RUN",
      provider: "DRY_RUN",
      externalId: null,
      error: null,
    };
  }
}
