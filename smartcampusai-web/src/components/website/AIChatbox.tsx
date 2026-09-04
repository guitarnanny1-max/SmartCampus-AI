"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const quickActions = [
  { label: "Explore the platform", href: "/solutions" },
  { label: "See pricing", href: "/pricing" },
  { label: "Explore AI", href: "/product/ai" },
  { label: "Request a demo", href: "/demo" },
];

const answers: Record<string, string> = {
  pricing:
    "SmartCampusAI offers flexible plans for educational institutions. I can take you to the pricing page or help you request a demo.",
  price:
    "SmartCampusAI offers flexible plans based on your institution's requirements. Let's look at the current pricing options.",
  ai:
    "SmartCampusAI AI brings institutional intelligence into everyday workflows — helping teams understand data, identify trends and act faster.",
  erp:
    "Education ERP connects students, academics, attendance, examinations, fees and administration in one platform.",
  lms:
    "The Learning Platform brings courses, assignments, assessments and learning progress together.",
  crm:
    "Admissions CRM helps institutions manage enquiries, counselling, applications and admissions from one connected workflow.",
  bms:
    "Business Management connects finance, HR, assets, inventory, procurement and campus operations.",
  demo:
    "Absolutely. I can take you to our demo request page where you can tell us about your institution and requirements.",
};

function getAnswer(input: string) {
  const text = input.toLowerCase();

  if (
    text.includes("demo") ||
    text.includes("sales") ||
    text.includes("contact") ||
    text.includes("talk")
  ) {
    return answers.demo;
  }

  if (text.includes("price") || text.includes("pricing") || text.includes("cost")) {
    return answers.pricing;
  }

  if (text.includes("ai") || text.includes("artificial intelligence")) {
    return answers.ai;
  }

  if (text.includes("erp") || text.includes("student") || text.includes("attendance")) {
    return answers.erp;
  }

  if (text.includes("lms") || text.includes("learning") || text.includes("course")) {
    return answers.lms;
  }

  if (text.includes("crm") || text.includes("admission") || text.includes("enquiry")) {
    return answers.crm;
  }

  if (
    text.includes("bms") ||
    text.includes("finance") ||
    text.includes("hr") ||
    text.includes("inventory")
  ) {
    return answers.bms;
  }

  if (
    text.includes("what is smartcampus") ||
    text.includes("what does smartcampus") ||
    text.includes("what is smart campus")
  ) {
    return "SmartCampusAI is an intelligent operating system for education that connects academics, admissions, administration, finance, learning, business operations and AI in one platform.";
  }

  return "I can help you explore SmartCampusAI, products, pricing and demos. Try asking about AI, ERP, CRM, LMS, BMS, pricing or a demo.";
}

export default function AIChatbox() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the SmartCampusAI AI Concierge. I can help you explore the platform, products, pricing or request a demo.",
    },
  ]);

  const sendMessage = (text = input) => {
    const value = text.trim();

    if (!value) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: value },
      { role: "assistant", content: getAnswer(value) },
    ]);

    setInput("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#7C3AED] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(124,58,237,0.35)]"
        aria-label="Open SmartCampusAI AI Concierge"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Sparkles size={17} />
        </span>
        Ask SmartCampusAI
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[calc(100vw-2rem)] max-w-[390px]">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.20)]">
        <div className="bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#7C3AED] p-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Bot size={23} />
              </div>

              <div>
                <p className="font-semibold">SmartCampusAI AI</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  AI Concierge
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((value) => !value)}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Minimize chatbot"
              >
                <ChevronDown
                  size={17}
                  className={minimized ? "rotate-180 transition" : "transition"}
                />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Close chatbot"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="max-h-[390px] space-y-4 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="grid gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span>{action.label}</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {messages.length > 1 &&
                messages[messages.length - 1].role === "assistant" &&
                (messages[messages.length - 2]?.content
                  .toLowerCase()
                  .includes("demo") ||
                  messages[messages.length - 2]?.content
                    .toLowerCase()
                    .includes("sales")) && (
                  <Link
                    href="/demo"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Request a demo
                    <ArrowRight size={15} />
                  </Link>
                )}
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-blue-400">
                <MessageCircle
                  size={17}
                  className="ml-2 shrink-0 text-slate-400"
                />

                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder="Ask about SmartCampusAI..."
                  className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
                  aria-label="Ask SmartCampusAI"
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <Check size={11} />
                SmartCampusAI website assistant
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
