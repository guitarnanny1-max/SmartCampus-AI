import { prisma } from "@/lib/prisma";
import { extractPublicWebsite } from "@/lib/platform-crm/url-extractor";
import {
  discoverWebsite,
} from "@/lib/platform-crm/website-discovery";
import {
  dispatchCampaignMessage,
  getCampaignProviderMode,
} from "@/lib/campaign-providers";
import {
  executeCrmAction,
  registerCrmAction,
} from "@/lib/platform-crm/action-registry";

type AutomationStepConfig = Record<string, unknown>;

type RunResult = {
  executionId: string;
  status: string;
  currentStep: number;
  completed: boolean;
};

function asConfig(value: unknown): AutomationStepConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as AutomationStepConfig;
}

export async function createAutomationExecution(
  automationId: string,
  leadId?: string,
  context?: Record<string, unknown>,
) {
  const automation = await prisma.crmAutomation.findUnique({
    where: { id: automationId },
    include: {
      steps: {
        orderBy: { stepOrder: "asc" },
      },
    },
  });

  if (!automation) throw new Error("Automation not found");
  if (automation.status !== "ACTIVE") {
    throw new Error("Automation is not active");
  }
  if (automation.steps.length === 0) {
    throw new Error("Automation has no steps");
  }

  if (leadId) {
    const lead = await prisma.platform_crm_leads.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!lead) throw new Error("Lead not found");
  }

  return prisma.crmAutomationExecution.create({
    data: {
      automationId,
      leadId,
      status: "PENDING",
      currentStep: 0,
      context: context ?? {},
    },
    include: {
      automation: {
        include: {
          steps: {
            orderBy: { stepOrder: "asc" },
          },
        },
      },
    },
  });
}

export async function runAutomationExecution(
  executionId: string,
): Promise<RunResult> {
  let execution = await prisma.crmAutomationExecution.findUnique({
    where: { id: executionId },
    include: {
      automation: {
        include: {
          steps: {
            orderBy: { stepOrder: "asc" },
          },
        },
      },
    },
  });

  if (!execution) {
    throw new Error("Automation execution not found");
  }

  if (
    execution.status === "COMPLETED" ||
    execution.status === "FAILED" ||
    execution.status === "CANCELLED"
  ) {
    return {
      executionId,
      status: execution.status,
      currentStep: execution.currentStep,
      completed: execution.status === "COMPLETED",
    };
  }

  const steps = execution.automation.steps;

  while (execution.currentStep < steps.length) {
    const step = steps[execution.currentStep];

    /*
     * Approval gate.
     */
    if (step.requiresApproval) {
      const approvedApproval = await prisma.crmAutomationApproval.findFirst({
        where: {
          executionId,
          stepId: step.id,
          status: "APPROVED",
        },
      });

      if (!approvedApproval) {
        const pendingApproval = await prisma.crmAutomationApproval.findFirst({
          where: {
            executionId,
            stepId: step.id,
            status: "PENDING",
          },
        });

        if (!pendingApproval) {
          await prisma.crmAutomationApproval.create({
            data: {
              executionId,
              stepId: step.id,
              status: "PENDING",
            },
          });
        }

        execution = await prisma.crmAutomationExecution.update({
          where: { id: executionId },
          data: {
            status: "WAITING_APPROVAL",
            startedAt: execution.startedAt ?? new Date(),
          },
          include: {
            automation: {
              include: {
                steps: {
                  orderBy: { stepOrder: "asc" },
                },
              },
            },
          },
        });

        return {
          executionId,
          status: execution.status,
          currentStep: execution.currentStep,
          completed: false,
        };
      }

      // An approved gate exists, so continue executing the current step.
    }

    /*
     * Delay gate.
     *
     * Delay is measured from the previous completed step rather than
     * from the original execution creation time.
     */
    if (step.delayMinutes > 0) {
      const previousStep = steps[execution.currentStep - 1];

      if (previousStep) {
        const previousRun =
          await prisma.crmAutomationStepExecution.findFirst({
            where: {
              executionId,
              stepId: previousStep.id,
              status: "COMPLETED",
            },
            orderBy: { completedAt: "desc" },
          });

        if (previousRun?.completedAt) {
          const readyAt = new Date(
            previousRun.completedAt.getTime() +
              step.delayMinutes * 60 * 1000,
          );

          if (new Date() < readyAt) {
            await prisma.crmAutomationExecution.update({
              where: { id: executionId },
              data: {
                status: "WAITING",
                startedAt: execution.startedAt ?? new Date(),
              },
            });

            return {
              executionId,
              status: "WAITING",
              currentStep: execution.currentStep,
              completed: false,
            };
          }
        }
      }
    }

    await prisma.crmAutomationExecution.update({
      where: { id: executionId },
      data: {
        status: "RUNNING",
        startedAt: execution.startedAt ?? new Date(),
      },
    });

    const stepRun = await prisma.crmAutomationStepExecution.create({
      data: {
        executionId,
        stepId: step.id,
        status: "RUNNING",
        startedAt: new Date(),
      },
    });

    try {
      const output = await executeCrmAction(
        step.actionType,
        {
          executionId,
          stepId: step.id,
          leadId: execution.leadId,
          config: asConfig(step.config),
          context:
            execution.context &&
            typeof execution.context === "object" &&
            !Array.isArray(execution.context)
              ? (execution.context as Record<string, unknown>)
              : {},
        },
      );

      await prisma.crmAutomationStepExecution.update({
        where: { id: stepRun.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          output,
        },
      });

      if (
        step.actionType === "SET_CONTEXT" &&
        output &&
        typeof output === "object" &&
        !Array.isArray(output) &&
        "values" in output &&
        output.values &&
        typeof output.values === "object" &&
        !Array.isArray(output.values)
      ) {
        const mergedContext = {
          ...((execution.context as Record<string, unknown>) ?? {}),
          ...(output.values as Record<string, unknown>),
        };

        execution = await prisma.crmAutomationExecution.update({
          where: { id: executionId },
          data: {
            context: mergedContext,
          },
          include: {
            automation: {
              include: {
                steps: {
                  orderBy: { stepOrder: "asc" },
                },
              },
            },
          },
        });
      }

      if (
        output &&
        typeof output === "object" &&
        !Array.isArray(output) &&
        "contextUpdate" in output &&
        output.contextUpdate &&
        typeof output.contextUpdate === "object" &&
        !Array.isArray(output.contextUpdate)
      ) {
        const currentContext =
          execution.context &&
          typeof execution.context === "object" &&
          !Array.isArray(execution.context)
            ? (execution.context as Record<string, unknown>)
            : {};

        const contextUpdate =
          output.contextUpdate as Record<string, unknown>;

        const mergedContext = {
          ...currentContext,
          ...contextUpdate,
        };

        execution = await prisma.crmAutomationExecution.update({
          where: { id: executionId },
          data: {
            context: mergedContext,
          },
          include: {
            automation: {
              include: {
                steps: {
                  orderBy: { stepOrder: "asc" },
                },
              },
            },
          },
        });
      }

      const nextStep = execution.currentStep + 1;
      const isComplete = nextStep >= steps.length;

      execution = await prisma.crmAutomationExecution.update({
        where: { id: executionId },
        data: {
          currentStep: nextStep,
          status: isComplete ? "COMPLETED" : "PENDING",
          completedAt: isComplete ? new Date() : null,
        },
        include: {
          automation: {
            include: {
              steps: {
                orderBy: { stepOrder: "asc" },
              },
            },
          },
        },
      });

      if (isComplete) {
        return {
          executionId,
          status: execution.status,
          currentStep: execution.currentStep,
          completed: true,
        };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Automation step failed";

      await prisma.crmAutomationStepExecution.update({
        where: { id: stepRun.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: message,
        },
      });

      await prisma.crmAutomationExecution.update({
        where: { id: executionId },
        data: {
          status: "FAILED",
          error: message,
        },
      });

      throw error;
    }
  }

  return {
    executionId,
    status: "COMPLETED",
    currentStep: execution.currentStep,
    completed: true,
  };
}

const LEGACY_CRM_ACTIONS = [
  "NO_OP",
  "SET_CONTEXT",
  "LOG",
  "CHECK_LEAD",
  "FIND_WEBSITE",
  "EXTRACT_WEBSITE",
  "ENRICH_LEAD_FROM_WEBSITE",
  "SEND_WHATSAPP",
  "SEND_EMAIL",
] as const;

async function executeCheckLeadAction(
  input: {
    actionType: string;
    leadId: string | null;
    config: AutomationStepConfig;
    context: unknown;
  },
) {
  const { actionType, leadId } = input;


    return {
      actionType,
      executed: true,
      leadId,
      context,
    };
}

async function executeSafeStep(
  actionType: string,
  config: AutomationStepConfig,
  leadId: string | null,
  context: unknown,
) {
  switch (actionType) {
    case "NO_OP":
      return {
        actionType,
        executed: true,
      };

    case "SET_CONTEXT":
      return {
        actionType,
        executed: true,
        values: config,
      };

    case "LOG":
      return {
        actionType,
        executed: true,
        message:
          typeof config.message === "string"
            ? config.message
            : null,
      };

    case "FIND_WEBSITE": {
      if (!leadId) {
        throw new Error("FIND_WEBSITE requires a lead");
      }

      const lead = await prisma.platform_crm_leads.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          campus_name: true,
          city: true,
          state: true,
          website: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (lead.website) {
        return {
          actionType,
          executed: true,
          found: true,
          website: lead.website,
          confidence: "EXISTING",
          source: "LEAD_RECORD",
          candidates: [
            {
              website: lead.website,
              title: lead.campus_name,
              confidence: "EXISTING",
            },
          ],
          leadId,
        };
      }

      const result = await discoverWebsite({
        campusName: lead.campus_name,
        city: lead.city,
        state: lead.state,
      });

      return {
        actionType,
        executed: true,
        leadId,
        ...result,
        contextUpdate: {
          websiteDiscovery: result,
        },
      };
    }

    case "EXTRACT_WEBSITE": {
      if (!leadId) {
        throw new Error("EXTRACT_WEBSITE requires a lead");
      }

      const lead = await prisma.platform_crm_leads.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          website: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      const configuredWebsite =
        typeof config.website === "string" ? config.website.trim() : "";

      const contextWebsite =
        typeof context === "object" &&
        context !== null &&
        !Array.isArray(context) &&
        typeof (context as Record<string, unknown>).website === "string"
          ? String(
              (context as Record<string, unknown>).website,
            ).trim()
          : "";

      const website =
        lead.website || configuredWebsite || contextWebsite;

      if (!website) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "No website available for lead or automation context",
          leadId,
        };
      }

      const result = await extractPublicWebsite(website);

      return {
        actionType,
        executed: true,
        leadId,
        source: result.source,
        extracted: result.extracted,
        contextUpdate: {
          websiteExtraction: {
            source: result.source,
            extracted: result.extracted,
          },
        },
      };
    }

    case "ENRICH_LEAD_FROM_WEBSITE": {
      if (!leadId) {
        throw new Error("ENRICH_LEAD_FROM_WEBSITE requires a lead");
      }

      const lead = await prisma.platform_crm_leads.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          email: true,
          mobile: true,
          whatsappNumber: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      const currentContext =
        context &&
        typeof context === "object" &&
        !Array.isArray(context)
          ? (context as Record<string, unknown>)
          : {};

      const websiteExtraction = currentContext.websiteExtraction;

      if (
        !websiteExtraction ||
        typeof websiteExtraction !== "object" ||
        Array.isArray(websiteExtraction)
      ) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "No website extraction found in automation context",
          leadId,
        };
      }

      const extracted =
        (websiteExtraction as Record<string, unknown>).extracted;

      if (
        !extracted ||
        typeof extracted !== "object" ||
        Array.isArray(extracted)
      ) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Website extraction contains no extracted data",
          leadId,
        };
      }

      const data = extracted as Record<string, unknown>;

      const emails = Array.isArray(data.emails)
        ? data.emails.filter(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0,
          )
        : [];

      const phones = Array.isArray(data.phones)
        ? data.phones.filter(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0,
          )
        : [];

      const whatsappNumbers = Array.isArray(data.whatsappNumbers)
        ? data.whatsappNumbers.filter(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0,
          )
        : [];

      const updates: Record<string, unknown> = {};

      if (!lead.email && emails.length > 0) {
        updates.email = emails[0];
        updates.emailSource = "WEBSITE";
      }

      if (!lead.mobile && phones.length > 0) {
        updates.mobile = phones[0];
        updates.phoneSource = "WEBSITE";
      }

      if (!lead.whatsappNumber && whatsappNumbers.length > 0) {
        updates.whatsappNumber = whatsappNumbers[0];
        updates.whatsappSource = "WEBSITE";
      }

      updates.websiteExtractedAt = new Date();

      const updatedLead = await prisma.platform_crm_leads.update({
        where: { id: leadId },
        data: updates,
        select: {
          id: true,
          email: true,
          mobile: true,
          whatsappNumber: true,
          emailSource: true,
          phoneSource: true,
          whatsappSource: true,
          websiteExtractedAt: true,
        },
      });

      return {
        actionType,
        executed: true,
        leadId,
        changedFields: Object.keys(updates),
        lead: updatedLead,
      };
    }

    case "SEND_WHATSAPP": {
      if (!leadId) {
        throw new Error("SEND_WHATSAPP requires a lead");
      }

      const lead = await prisma.platform_crm_leads.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          campus_name: true,
          contact_name: true,
          whatsappNumber: true,
          whatsappAllowed: true,
          optedOut: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (lead.optedOut) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Lead has opted out",
          leadId,
        };
      }

      if (!lead.whatsappAllowed) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "WhatsApp consent not granted",
          leadId,
        };
      }

      if (!lead.whatsappNumber) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Lead has no WhatsApp number",
          leadId,
        };
      }

      const configuredMessage =
        typeof config.message === "string"
          ? config.message.trim()
          : "";

      const contextMessage =
        context &&
        typeof context === "object" &&
        !Array.isArray(context) &&
        typeof (context as Record<string, unknown>).whatsappMessage === "string"
          ? String(
              (context as Record<string, unknown>).whatsappMessage,
            ).trim()
          : "";

      const message = configuredMessage || contextMessage;

      if (!message) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "No WhatsApp message configured",
          leadId,
        };
      }

      const providerMode = getCampaignProviderMode();

      const providerResult = await dispatchCampaignMessage({
        channel: "WHATSAPP",
        recipient: lead.whatsappNumber,
        message,
        leadId: lead.id,
      });

      const communicationStatus = providerResult.success
        ? "SENT"
        : "FAILED";

      await prisma.communicationLog.create({
        data: {
          leadId: lead.id,
          channel: "WHATSAPP",
          direction: "OUTBOUND",
          status: communicationStatus,
          recipient: lead.whatsappNumber,
          message,
          provider: providerResult.provider,
          externalId: providerResult.externalId ?? null,
          attemptedAt: new Date(),
          completedAt: providerResult.success ? new Date() : null,
          error: providerResult.error ?? null,
        },
      });

      return {
        actionType,
        executed: true,
        leadId,
        providerMode,
        provider: providerResult.provider,
        success: providerResult.success,
        externalId: providerResult.externalId ?? null,
        error: providerResult.error ?? null,
      };
    }

    case "SEND_EMAIL": {
      if (!leadId) {
        throw new Error("SEND_EMAIL requires a lead");
      }

      const lead = await prisma.platform_crm_leads.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          email: true,
          emailAllowed: true,
          optedOut: true,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (lead.optedOut) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Lead has opted out",
          leadId,
        };
      }

      if (!lead.emailAllowed) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Email consent is not enabled",
          leadId,
        };
      }

      if (!lead.email) {
        return {
          actionType,
          executed: true,
          skipped: true,
          reason: "Lead has no email address",
          leadId,
        };
      }

      const message =
        typeof config.message === "string"
          ? config.message.trim()
          : "";

      if (!message) {
        throw new Error("SEND_EMAIL requires a message");
      }

      const subject =
        typeof config.subject === "string"
          ? config.subject.trim()
          : "SmartCampusAI";

      const providerMode = getCampaignProviderMode();

      const providerResult = await dispatchCampaignMessage({
        channel: "EMAIL",
        recipient: lead.email,
        message,
        subject,
        leadId,
      });

      await prisma.communicationLog.create({
        data: {
          leadId,
          channel: "EMAIL",
          direction: "OUTBOUND",
          status: providerResult.success ? "SENT" : "FAILED",
          recipient: lead.email,
          message,
          provider: providerResult.provider,
          externalId: providerResult.externalId ?? null,
          attemptedAt: new Date(),
          completedAt: providerResult.success ? new Date() : null,
          error: providerResult.error ?? null,
        },
      });

      return {
        actionType,
        executed: true,
        leadId,
        providerMode,
        provider: providerResult.provider,
        success: providerResult.success,
        externalId: providerResult.externalId ?? null,
        error: providerResult.error ?? null,
      };
    }

    default:
      throw new Error(
        `Unsupported automation action: ${actionType}`,
      );
  }
}

for (const actionType of LEGACY_CRM_ACTIONS) {
  if (actionType === "CHECK_LEAD") {
    registerCrmAction(actionType, async (input) =>
      executeCheckLeadAction({
        actionType,
        leadId: input.leadId ?? null,
        config: input.config ?? {},
        context: input.context,
      }),
    );
    continue;
  }

  registerCrmAction(actionType, async (input) => {
    return executeSafeStep(
      actionType,
      input.config ?? {},
      input.leadId ?? null,
      input.context,
    );
  });
}

export async function approveAutomationStep(
  executionId: string,
  stepId: string,
  approvedBy: string,
  note?: string,
) {
  const execution = await prisma.crmAutomationExecution.findUnique({
    where: { id: executionId },
    include: {
      automation: {
        include: {
          steps: {
            orderBy: { stepOrder: "asc" },
          },
        },
      },
    },
  });

  if (!execution) {
    throw new Error("Automation execution not found");
  }

  if (execution.status !== "WAITING_APPROVAL") {
    throw new Error(
      `Execution is not waiting for approval (status: ${execution.status})`,
    );
  }

  const currentStep = execution.automation.steps[execution.currentStep];

  if (!currentStep) {
    throw new Error("Current automation step not found");
  }

  if (currentStep.id !== stepId) {
    throw new Error("Approval step is not the current execution step");
  }

  if (!currentStep.requiresApproval) {
    throw new Error("Current automation step does not require approval");
  }

  const approval = await prisma.crmAutomationApproval.findFirst({
    where: {
      executionId,
      stepId: currentStep.id,
      status: "PENDING",
    },
  });

  if (!approval) {
    throw new Error("Pending approval not found");
  }

  await prisma.crmAutomationApproval.update({
    where: { id: approval.id },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy: approvedBy,
      note,
    },
  });

  await prisma.crmAutomationExecution.update({
    where: { id: executionId },
    data: {
      status: "PENDING",
    },
  });

  return runAutomationExecution(executionId);
}
