import {
  DryRunProvider,
} from "./dry-run";

import {
  EmailProvider,
} from "./email";

import {
  WhatsAppProvider,
} from "./whatsapp";

import {
  VoiceProvider,
} from "./voice";

import type {
  CampaignChannel,
  CampaignMessageInput,
  CampaignProvider,
  ProviderMode,
  ProviderResult,
} from "./types";

export type {
  CampaignChannel,
  CampaignMessageInput,
  CampaignProvider,
  ProviderMode,
  ProviderResult,
} from "./types";

function configuredMode(): ProviderMode {
  return process.env.CAMPAIGN_PROVIDER_MODE === "LIVE"
    ? "LIVE"
    : "DRY_RUN";
}

function liveProvider(
  channel: CampaignChannel
): CampaignProvider {
  switch (channel) {
    case "EMAIL":
      return new EmailProvider();

    case "WHATSAPP":
      return new WhatsAppProvider();

    case "VOICE":
      return new VoiceProvider();
  }
}

function getProvider(
  channel: CampaignChannel
): CampaignProvider {
  if (configuredMode() === "DRY_RUN") {
    return new DryRunProvider(channel);
  }

  return liveProvider(channel);
}

export async function dispatchCampaignMessage(
  input: CampaignMessageInput
): Promise<ProviderResult> {
  return getProvider(input.channel).send(input);
}

export function getCampaignProviderMode(): ProviderMode {
  return configuredMode();
}
