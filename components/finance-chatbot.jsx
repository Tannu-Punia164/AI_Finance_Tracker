"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hi! I’m Bachat Buddy. Ask me about your spending, budget, or saving habits.",
};

export default function FinanceChatbot() {
  const { isSignedIn, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  if (!isLoaded || !isSignedIn) return null;

  async function sendMessage(event) {
    event.preventDefault();
    const content = input.trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error.message || "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section className="mb-3 flex h-[min(580px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-sm">
                <Image src="/chatbot-robot.jpg" alt="Bachat Buddy robot assistant" fill sizes="40px" className="object-cover" />
              </div>
              <div><p className="font-semibold">Bachat Buddy AI</p><p className="text-xs text-blue-100">Your private finance helper</p></div>
            </div>
            <Button type="button" variant="ghost" size="icon" className="text-white hover:bg-white/15 hover:text-white" onClick={() => setIsOpen(false)} aria-label="Close chat"><X /></Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={cn("max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6", message.role === "user" ? "ml-auto rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm bg-white text-slate-700 shadow-sm")}><p>{message.content}</p></div>)}
            {isSending && <div className="w-fit rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm"><Loader2 className="animate-spin text-blue-600" size={18} /></div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="border-t bg-white p-3">
            <div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} placeholder="Ask about your money..." className="h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" /><Button type="submit" size="icon" disabled={!input.trim() || isSending} aria-label="Send message"><Send size={18} /></Button></div>
            <p className="mt-2 text-center text-[10px] text-slate-400">AI can make mistakes. Not financial, investment, or tax advice.</p>
          </form>
        </section>
      )}
      <Button type="button" size="lg" className="h-16 rounded-full px-3 pr-5 shadow-lg" onClick={() => setIsOpen((open) => !open)} aria-label="Open Bachat Buddy AI chat">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-white">
          <Image src="/chatbot-robot.jpg" alt="" fill sizes="44px" className="object-cover" />
        </span>
        <span className="ml-2">Ask Bachat Buddy</span>
      </Button>
    </div>
  );
}
