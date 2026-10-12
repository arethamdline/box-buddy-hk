import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  History,
  Languages,
  MessageSquarePlus,
  Package,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import type { UIMessage } from "ai";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { handoffThread, sendWebsiteMessage, useSupport } from "@/lib/support-store";
import { statusLabels } from "@/lib/support-types";

type Thread = { id: string; title: string; updated: string; messages: UIMessage[] };
const defaults: Thread[] = [
  {
    id: "storage-prices",
    title: "Box sizes & pricing",
    updated: "Today",
    messages: [
      {
        id: "a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi, I’m **STORAGE**. I can help with storage plans, prices, pickup and delivery. 你好！我亦可以用繁體中文回答。",
          },
        ],
      },
      {
        id: "a2",
        role: "user",
        parts: [{ type: "text", text: "How much is storage for 6 boxes?" }],
      },
      {
        id: "a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Our standard 60L boxes start at **HK$79 per box / month**. For 6 boxes, that is **HK$474 monthly**. Pickup is free for rentals of 3 months or longer.",
          },
        ],
      },
    ],
  },
  {
    id: "prohibited-items",
    title: "What can I store?",
    updated: "Yesterday",
    messages: [
      { id: "b1", role: "user", parts: [{ type: "text", text: "有甚麼物品不可以存放？" }] },
      {
        id: "b2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "為安全起見，我們不接受食品、液體、植物、易燃或危險品、武器，以及任何違禁品。如你不確定某件物品，請先拍照並交由職員確認。",
          },
        ],
      },
    ],
  },
  {
    id: "delivery-access",
    title: "Delivery & access",
    updated: "23 Sep",
    messages: [
      { id: "c1", role: "user", parts: [{ type: "text", text: "Can I visit my boxes at night?" }] },
      {
        id: "c2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Door-to-door boxes are stored in our secure warehouse and returned by appointment. Personal lockers at selected facilities offer **24/7 smart access**.",
          },
        ],
      },
    ],
  },
];
const STORAGE = "storage-assistant-threads";
export const Route = createFileRoute("/assistant/$threadId")({
  head: () => ({
    meta: [
      { title: "Ask Bot — STORAGE" },
      { name: "description", content: "Bilingual storage help from the STORAGE assistant." },
      { property: "og:title", content: "Ask Bot — STORAGE" },
      { property: "og:description", content: "Bilingual help for storage plans and policies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssistantPage,
});
function AssistantPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    conversations: supportConversations,
    error: supportError,
    ready: supportReady,
  } = useSupport();
  const support = supportConversations.find((c) => c.threadId === threadId);
  const savedActive = threads.find((t) => t.id === threadId) ?? threads[0];
  const active: Thread | undefined = support
    ? {
        id: threadId,
        title: support.subject,
        updated: "Now",
        messages: support.messages
          .filter((m) => !["note", "system"].includes(m.source))
          .map((m) => ({
            id: m.id,
            role: m.source === "customer" ? "user" : "assistant",
            parts: [{ type: "text", text: m.text }],
          })),
      }
    : savedActive;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) setThreads(JSON.parse(saved) as Thread[]);
    } catch {
      setThreads(defaults);
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(threads));
  }, [threads, hydrated]);
  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);
  const reply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("price") || lower.includes("價"))
      return "Standard boxes are **HK$79 each / month**. Lockers start at **HK$328 / month**, and private rooms from **HK$688 / month**.";
    if (lower.includes("deposit") || lower.includes("按金"))
      return "A refundable deposit may apply. After your rental ends, we inspect returned items and review it within **3 business days**. Any deduction includes a written reason.";
    if (lower.includes("pickup") || lower.includes("delivery") || lower.includes("送"))
      return "We collect and return across all 18 Hong Kong districts. Choose an available two-hour window during booking.";
    if (lower.includes("prohibited") || lower.includes("store") || lower.includes("存放"))
      return "Please do not store food, liquids, plants, hazardous materials, weapons or illegal items.";
    return "I’m sorry, I don’t have a reliable answer for that yet. I can pass your question to our storage team for a personal reply. **Would you like me to contact staff?**";
  };
  const send = (text: string) => {
    if (!text.trim() || !active) return;
    if (support) {
      sendWebsiteMessage(support.id, text, reply(text));
      return;
    }
    const now = Date.now();
    setThreads((ts) =>
      ts.map((t) =>
        t.id === active.id
          ? {
              ...t,
              updated: "Now",
              messages: [
                ...t.messages,
                { id: `u${now}`, role: "user", parts: [{ type: "text", text }] },
                { id: `r${now}`, role: "assistant", parts: [{ type: "text", text: reply(text) }] },
              ],
            }
          : t,
      ),
    );
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const create = () => {
    const id = `conversation-${Date.now()}`;
    const t: Thread = {
      id,
      title: "New storage question",
      updated: "Now",
      messages: [
        {
          id: `hello-${id}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Hello! What would you like to know about storing with STORAGE? 你好！有甚麼可以幫到你？",
            },
          ],
        },
      ],
    };
    setThreads((ts) => [t, ...ts]);
    navigate({ to: "/assistant/$threadId", params: { threadId: id } });
  };
  if (!hydrated || !supportReady)
    return (
      <CustomerShell>
        <p className="p-8 text-center text-sm text-muted-foreground">Loading your conversation…</p>
      </CustomerShell>
    );
  if (!active) return null;
  return (
    <CustomerShell>
      <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-7xl overflow-hidden lg:h-[calc(100dvh-4rem)] md:border-x">
        <aside className="hidden w-72 shrink-0 border-r bg-card md:flex md:flex-col">
          <div className="border-b p-4">
            <Button className="w-full" onClick={create}>
              <Plus />
              New conversation
            </Button>
          </div>
          <div className="flex-1 space-y-1 overflow-auto p-2">
            {threads.map((t) => (
              <Link
                key={t.id}
                to="/assistant/$threadId"
                params={{ threadId: t.id }}
                className={cn(
                  "block rounded-md px-3 py-3",
                  t.id === active.id ? "bg-accent" : "hover:bg-muted",
                )}
              >
                <p className="truncate text-sm font-semibold">{t.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.updated}</p>
              </Link>
            ))}
          </div>
          <p className="border-t p-4 text-xs text-muted-foreground">Saved in this browser</p>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setHistoryOpen(true)}
                aria-label="Chat history"
              >
                <History />
              </Button>
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Package />
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-display font-bold">
                  {support && support.status !== "bot"
                    ? "STORAGE support team"
                    : "STORAGE assistant"}
                </h1>
                <p className="flex items-center gap-1 text-xs text-success-strong">
                  <span className="size-2 rounded-full bg-success-strong" />
                  English · 繁體中文
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={create} aria-label="New conversation">
              <MessageSquarePlus />
            </Button>
          </header>
          {supportError && (
            <p role="alert" className="bg-warning-soft p-3 text-xs text-warning-strong">
              {supportError}
            </p>
          )}
          {support && (
            <div className="border-b bg-info-soft/40 px-4 py-3 text-xs" role="status">
              <strong>{statusLabels[support.status]}</strong>
              <span className="ml-2">
                {support.status === "needs_staff"
                  ? "Your conversation is with our team. You can keep messaging here."
                  : support.status === "human"
                    ? `${support.assignee || "Our team"} is helping you here. The bot is paused.`
                    : support.status === "resolved"
                      ? "This request is resolved. Send a message if you need more help."
                      : "The bot is back. You can ask for our team again anytime."}
              </span>
            </div>
          )}
          <Conversation className="min-h-0">
            <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-8">
              {active.messages.map((m) => (
                <Message from={m.role} key={m.id}>
                  <div className="flex items-start gap-3">
                    {m.role === "assistant" && (
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-primary">
                        {support?.messages.find((item) => item.id === m.id)?.source === "staff" ? (
                          <UserRound className="size-4" />
                        ) : (
                          <Bot className="size-4" />
                        )}
                      </span>
                    )}
                    <MessageContent
                      className={m.role === "user" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {support?.messages.find((item) => item.id === m.id)?.source === "staff" && (
                        <p className="mb-1 text-xs font-semibold text-primary">
                          {support.messages.find((item) => item.id === m.id)?.author} · Support team
                        </p>
                      )}
                      {m.parts.map((p, i) =>
                        p.type === "text" ? (
                          <MessageResponse key={i}>{p.text}</MessageResponse>
                        ) : null,
                      )}
                    </MessageContent>
                    {m.role === "user" && (
                      <UserRound className="mt-1 size-5 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                </Message>
              ))}
              <ConversationScrollButton />
            </ConversationContent>
          </Conversation>
          <div className="border-t bg-background p-3">
            <div className="mx-auto max-w-3xl">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  disabled={
                    !supportReady ||
                    (!!support && ["needs_staff", "human"].includes(support.status))
                  }
                  onClick={() => handoffThread(active)}
                >
                  <UserRound />
                  {support && ["needs_staff", "human"].includes(support.status)
                    ? "Team notified"
                    : "Talk to staff"}
                </Button>
                {(!support || support.status === "bot") &&
                  ["Prices & sizes", "Deposit policy", "Pickup areas", "可存放物品"].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => send(q)}
                    >
                      {q}
                    </Button>
                  ))}
              </div>
              <PromptInput onSubmit={(m) => send(m.text)}>
                <PromptInputTextarea
                  ref={inputRef}
                  placeholder={
                    support && support.status !== "bot"
                      ? "Message our team… / 聯絡職員…"
                      : "Ask about storage… / 查詢迷你倉服務…"
                  }
                />
                <PromptInputFooter>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Languages className="size-3" />
                    Bilingual help
                  </span>
                  <PromptInputSubmit />
                </PromptInputFooter>
              </PromptInput>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Prototype · chat saved in this browser · no live support connected
              </p>
            </div>
          </div>
        </section>
      </div>
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-[min(86vw,22rem)] p-0">
          <SheetHeader className="border-b p-4 pr-12 text-left">
            <SheetTitle>Chat history</SheetTitle>
            <Button
              className="mt-3 w-full"
              onClick={() => {
                setHistoryOpen(false);
                create();
              }}
            >
              <Plus /> New conversation
            </Button>
          </SheetHeader>
          <div className="space-y-1 overflow-y-auto p-2">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                to="/assistant/$threadId"
                params={{ threadId: thread.id }}
                onClick={() => setHistoryOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-3",
                  thread.id === active.id ? "bg-accent" : "hover:bg-muted",
                )}
              >
                <p className="truncate text-sm font-semibold">{thread.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{thread.updated}</p>
              </Link>
            ))}
          </div>
          <p className="absolute inset-x-0 bottom-0 border-t bg-background p-4 text-xs text-muted-foreground">
            Saved in this browser
          </p>
        </SheetContent>
      </Sheet>
    </CustomerShell>
  );
}
