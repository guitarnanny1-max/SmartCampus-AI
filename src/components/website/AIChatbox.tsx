"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type AIChatboxProps = {
  onRequestDemo?: () => void;
};

type SpeechRecognitionResultEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const faqResponses: Record<string, string> = {
  pricing:
    "SmartCampusAI pricing is customized based on school size, selected modules, campuses, and operational requirements. I can help you request a demo.",

  ai:
    "SmartCampusAI uses intelligent insights to help school teams understand attendance trends, fee follow-ups, admissions activity, operational alerts, and other school data.",

  students:
    "SmartCampusAI manages student profiles, classes, sections, guardians, documents, academic history, attendance, and related school records.",

  crm:
    "Yes. SmartCampusAI includes admissions CRM capabilities for capturing enquiries, managing prospective families, tracking follow-ups, monitoring admission pipelines, and converting qualified leads into admissions.",

  security:
    "SmartCampusAI is designed around role-based access, tenant-aware architecture, secure authentication, and database-level security controls.",

  demo:
    "Absolutely. Click the Request Demo button below and provide your school details. Your enquiry will be added to our CRM for follow-up.",
};

function getResponse(message: string) {
  const input = message.toLowerCase();

  if (
    input.includes("price") ||
    input.includes("pricing") ||
    input.includes("cost")
  ) {
    return faqResponses.pricing;
  }

  if (
    input.includes("ai") ||
    input.includes("artificial intelligence") ||
    input.includes("insight")
  ) {
    return faqResponses.ai;
  }

  if (input.includes("student") || input.includes("students")) {
    return faqResponses.students;
  }

  if (
    input.includes("crm") ||
    input.includes("lead") ||
    input.includes("admission") ||
    input.includes("enquiry")
  ) {
    return faqResponses.crm;
  }

  if (
    input.includes("security") ||
    input.includes("secure") ||
    input.includes("data")
  ) {
    return faqResponses.security;
  }

  if (
    input.includes("demo") ||
    input.includes("contact") ||
    input.includes("sales")
  ) {
    return faqResponses.demo;
  }

  return "I can help with SmartCampusAI features, AI capabilities, student management, admissions CRM, pricing, security, or requesting a demo. What would you like to know?";
}

export default function AIChatbox({
  onRequestDemo,
}: AIChatboxProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Hi! I'm the SmartCampusAI assistant. I can answer questions about the platform or help you request a demo.",
    },
  ]);

  function speak(text: string) {
    if (!voiceEnabled || typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  function sendMessage(text?: string) {
    const trimmed = (text ?? message).trim();

    if (!trimmed) return;

    const timestamp = Date.now();
    const response = getResponse(trimmed);

    const userMessage: Message = {
      id: timestamp,
      role: "user",
      text: trimmed,
    };

    const assistantMessage: Message = {
      id: timestamp + 1,
      role: "assistant",
      text: response,
    };

    setMessages((current) => [
      ...current,
      userMessage,
      assistantMessage,
    ]);

    setMessage("");

    speak(response);
  }

  function startListening() {
    if (typeof window === "undefined") return;

    const browserWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const SpeechRecognitionAPI =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert(
        "Voice input is not supported by this browser. Please use Google Chrome or Microsoft Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0]?.[0]?.transcript ?? "";

      if (!transcript) return;

      setMessage(transcript);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleVoice() {
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
    }

    setVoiceEnabled((current) => !current);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleDemoRequest() {
    window.speechSynthesis?.cancel();
    setOpen(false);
    onRequestDemo?.();
  }

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      window.speechSynthesis?.cancel();
    }
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  SmartCampusAI Assistant
                </p>

                <p className="text-xs text-slate-400">
                  Ask or speak about our platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={
                  voiceEnabled
                    ? "Mute assistant voice"
                    : "Enable assistant voice"
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="h-80 space-y-4 overflow-y-auto bg-slate-50 p-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex gap-2 ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {item.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item.text}
                </div>

                {item.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about SmartCampusAI..."
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={
                  listening
                    ? stopListening
                    : startListening
                }
                aria-label={
                  listening
                    ? "Stop listening"
                    : "Speak your question"
                }
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${
                  listening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                {listening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => sendMessage()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDemoRequest}
              className="mt-3 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              Request a SmartCampusAI Demo
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          open
            ? "Close SmartCampusAI chat"
            : "Open SmartCampusAI chat"
        }
        className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:scale-105 hover:bg-indigo-700 sm:right-6"
      >
        {open ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
