export type CampaignChannel =
  | "EMAIL"
  | "WHATSAPP"
  | "VOICE";

export type ProviderMode =
  | "DRY_RUN"
  | "LIVE";

export type CampaignMessageInput = {
  channel: CampaignChannel;
  recipient: string;
  message: string;
  subject?: string | null;
  leadId?: string;
  campaignId?: string;
  campaignStepId?: string;
};

export type ProviderResult = {
  success: boolean;
  mode: ProviderMode;
  provider: string;
  externalId?: string | null;
  error?: string | null;
};

export interface CampaignProvider {
  channel: CampaignChannel;

  send(
    input: CampaignMessageInput
  ): Promise<ProviderResult>;
}
