"use client";

import Link from "next/link";

export type ProcessStep = {
  id: string;
  label: string;
  href?: string;
  completed?: boolean;
  disabled?: boolean;
};

type ProcessStepperProps = {
  steps: ProcessStep[];
  currentStep: string;
};

export default function ProcessStepper({
  steps,
  currentStep,
}: ProcessStepperProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-max items-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {steps.map((step, index) => {
          const currentIndex = steps.findIndex(
            (item) => item.id === currentStep,
          );

          const stepIndex = index;
          const isCurrent = step.id === currentStep;
          const isCompleted =
            step.completed || stepIndex < currentIndex;

          const content = (
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isCurrent
                    ? "bg-[var(--sc-primary)] text-white shadow-md"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {isCompleted && !isCurrent ? "✓" : index + 1}
              </span>

              <span
                className={`whitespace-nowrap text-sm font-semibold ${
                  isCurrent
                    ? "text-slate-950"
                    : isCompleted
                      ? "text-emerald-700"
                      : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );

          return (
            <div key={step.id} className="flex items-center">
              {step.href && !step.disabled ? (
                <Link
                  href={step.href}
                  className="rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                >
                  {content}
                </Link>
              ) : (
                <div
                  className={`px-2 py-1.5 ${
                    step.disabled ? "opacity-50" : ""
                  }`}
                >
                  {content}
                </div>
              )}

              {index < steps.length - 1 && (
                <span
                  className={`mx-1 h-px w-6 ${
                    stepIndex < currentIndex
                      ? "bg-emerald-400"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
