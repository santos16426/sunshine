"use client";
import {
  Smile,
  X,
  User,
  Loader2,
  ExternalLink,
  Send,
  MessageCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function IntelligentChatbot({
  messengerLink,
}: {
  messengerLink: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! 👋 I'm the Sunshine Assistant. I can tell you about our speech therapy, occupational therapy, and school readiness programs. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Monitor scroll position to show/hide bot
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Calculate scroll percentage
      const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

      // Threshold: 40% of page.
      // Also hides if we are back at the top (less than 100px from top)
      if (scrollPercent > 0.2 && scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // Auto-close if user scrolls back to top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use a separate dummy div at the end of the list for better scroll anchoring
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (delay = 0) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, delay);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(100);
    }
  }, [messages, isLoading, isOpen]);

  const callGemini = async (userQuery: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const systemPrompt = `
      You are "Sunshine Bot", the friendly AI assistant for Sunshine Learning Hub in Angeles City.
      Our services:
      1. Speech Therapy (for articulation, delay, etc.)
      2. Occupational Therapy (for sensory issues, motor skills)
      3. School Readiness (preparing 3-5 year olds for big school)
      4. SPED Programs (individualized programs for neurodivergent children)

      School prompt (School Readiness): We help children ages 3–5 get ready for big school. Our program covers early literacy and numeracy, following routines, social skills, fine and gross motor skills, and confidence so they transition smoothly to formal schooling. Emphasize that it’s ideal for parents who want their child prepared and comfortable before kindergarten or Grade 1.

      Pricing: Session rates are typically in the range ₱300–₱900 per session, depending on the service and program. When asked about cost, give this range and invite them to message us (click "Talk to a Human") or call 09286815672 for exact rates and packages.

      Location: 128 Don Pepe Henson Avenue, Angeles City, Philippines.
      Phone: 09286815672.

      Tone: Encouraging, professional, warm, and helpful.
      Goal: Answer questions about our services. If the parent wants to enroll or talk to a real person, tell them to click the "Talk to a Human" button below.
      Keep responses concise (2-3 sentences).
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        },
      );

      const result = await response.json();
      return (
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I'm having trouble thinking right now. Please message us on Facebook!"
      );
    } catch (error) {
      return "Oops! My connection is a bit fuzzy. Please click the button below to message our team on Facebook directly.";
    }
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInputValue("");
    setIsLoading(true);

    const botResponse = await callGemini(userText);
    setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-300 flex flex-col items-end transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      {" "}
      {isOpen && (
        <div className="mb-4 w-[320px] md:w-[400px] bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[12px_12px_0_0_rgba(15,23,42,1)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#00B2FF] p-6 border-b-4 border-slate-900 flex justify-between items-center z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-900 flex items-center justify-center relative">
                <Smile className="text-[#00B2FF]" size={28} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tight leading-none">
                  Sunshine AI
                </h4>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Instant Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/20 hover:bg-white/40 p-2 rounded-xl transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Body - Scrollable Area */}
          <div className="relative flex-1 bg-[#f8fafc]">
            {/* Top Fade Overlay */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>

            <div
              ref={scrollRef}
              className="h-[350px] overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 border-2 border-slate-900 flex items-center justify-center ${m.role === "user" ? "bg-amber-300" : "bg-white"}`}
                  >
                    {m.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Smile size={16} />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl font-bold text-sm border-2 border-slate-900 shadow-sm ${m.role === "user" ? "bg-sky-100 rounded-tr-none" : "bg-white rounded-tl-none"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center">
                    <Loader2 className="animate-spin text-sky-400" size={16} />
                  </div>
                  <div className="bg-white border-2 border-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              {/* Anchor for scrolling */}
              <div ref={messagesEndRef} className="h-2 w-full" />
            </div>

            {/* Quick Action Overlay (Stays at bottom of scrollable area) */}
            <div className="p-3 bg-white/50 border-t-2 border-slate-100 text-center">
              <a
                href={messengerLink}
                target="_blank"
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ExternalLink size={12} /> Talk to a Human (Messenger)
              </a>
            </div>
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t-4 border-slate-900 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-100 border-2 border-slate-900 px-4 py-3 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 ring-sky-400"
            />
            <button
              disabled={isLoading}
              type="submit"
              className="bg-[#00B2FF] border-2 border-slate-900 p-3 rounded-xl hover:translate-y-[-2px] transition-transform active:translate-y-0 disabled:opacity-50"
            >
              <Send size={20} className="text-white" />
            </button>
          </form>
        </div>
      )}
      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-white border-4 border-slate-900 p-2 pr-6 rounded-full shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] transition-all active:translate-y-0"
      >
        <div className="w-14 h-14 bg-[#00B2FF] rounded-full border-4 border-slate-900 flex items-center justify-center text-white">
          {isOpen ? (
            <X size={28} />
          ) : (
            <MessageCircle size={32} fill="currentColor" strokeWidth={0} />
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
            Instant Help
          </span>
          <span className="text-lg font-black leading-none uppercase">
            Ask Sunshine
          </span>
        </div>
      </button>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `,
        }}
      />
    </div>
  );
}
