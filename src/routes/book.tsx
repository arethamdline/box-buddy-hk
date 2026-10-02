import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Box,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Landmark,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { CustomerShell } from "@/components/customer-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { boxItems, fees, plans, slots, unitSizes } from "@/data/mock-data";
import { cn } from "@/lib/utils";
const labels = ["Plan", "Size", "Term", "Start", "Service", "Time", "Review", "Payment", "Done"];
const formatMoney = (amount: number) =>
  amount.toLocaleString("en-HK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book storage — STORAGE" },
      { name: "description", content: "Choose a storage plan, pickup time and simulated payment." },
      { property: "og:title", content: "Book storage — STORAGE" },
      {
        property: "og:description",
        content: "A simple nine-step Hong Kong storage booking experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Booking,
});
function Booking() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState("box");
  const [itemQty, setItemQty] = useState<Record<string, number>>({ medium: 6 });
  const [size, setSize] = useState("Medium");
  const [term, setTerm] = useState(6);
  const [includeParking, setIncludeParking] = useState(false);
  const [differentAddress, setDifferentAddress] = useState(false);
  const [date, setDate] = useState("2026-10-02");
  const [service, setService] = useState("Pickup");
  const [slot, setSlot] = useState("14:00–16:00");
  const [method, setMethod] = useState("FPS");
  const [seconds, setSeconds] = useState(899);
  useEffect(() => {
    if (step !== 7) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);
  const selected = plans.find((p) => p.id === plan) ??
    plans[0] ?? {
      id: "box",
      name: "Door-to-door boxes",
      zh: "上門迷你箱",
      price: 79,
      unit: "box / month",
      note: "",
    };
  const monthly =
    plan === "box"
      ? boxItems.reduce((sum, item) => sum + item.price * (itemQty[item.id] ?? 0), 0)
      : ((plan === "locker" ? unitSizes.locker : unitSizes.room).find((unit) => unit.id === size)
          ?.price ?? 0);
  const subtotal = monthly * term;
  const discount =
    term >= fees.promoMinTerm ? Math.round(subtotal * fees.promoDiscount * 100) / 100 : 0;
  const pickupFee = service === "Pickup" ? fees.pickup : 0;
  const parkingFee = includeParking ? fees.parking : 0;
  const addressFee = differentAddress ? fees.differentAddress : 0;
  const total = subtotal - discount + parkingFee + pickupFee + addressFee;
  const priceLines =
    plan === "box"
      ? boxItems
          .filter((item) => (itemQty[item.id] ?? 0) > 0)
          .map((item) => ({
            label: `${item.name} (HK$${item.price} × ${itemQty[item.id]} × ${term} months)`,
            amount: item.price * (itemQty[item.id] ?? 0) * term,
          }))
      : [{ label: `${size} ${selected.name} (${term} months)`, amount: subtotal }];
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0"),
    ss = String(seconds % 60).padStart(2, "0");
  const next = () => setStep((s) => Math.min(8, s + 1));
  return (
    <CustomerShell>
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        <div className="mb-6 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => (step ? setStep(step - 1) : history.back())}
            aria-label="Back"
          >
            <ArrowLeft />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Step {step + 1} of 9</p>
            <h1 className="font-display text-2xl font-bold">
              {step === 8 ? "Booking confirmed" : labels[step]}
            </h1>
          </div>
        </div>
        <div className="mb-8 flex gap-1">
          {labels.map((l, i) => (
            <div key={l} className="min-w-0 flex-1">
              <div className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
              <span className="mt-1 hidden text-[10px] text-muted-foreground md:block">{l}</span>
            </div>
          ))}
        </div>
        <div className={cn("grid gap-7", step >= 6 && step < 8 ? "lg:grid-cols-[1fr_340px]" : "")}>
          <div>
            <StepContent
              step={step}
              plan={plan}
              setPlan={setPlan}
              itemQty={itemQty}
              setItemQty={setItemQty}
              size={size}
              setSize={setSize}
              term={term}
              setTerm={setTerm}
              date={date}
              setDate={setDate}
              service={service}
              setService={setService}
              slot={slot}
              setSlot={setSlot}
              method={method}
              setMethod={setMethod}
              total={total}
              monthly={monthly}
              subtotal={subtotal}
              discount={discount}
              pickupFee={pickupFee}
              parkingFee={parkingFee}
              addressFee={addressFee}
              includeParking={includeParking}
              setIncludeParking={setIncludeParking}
              differentAddress={differentAddress}
              setDifferentAddress={setDifferentAddress}
              priceLines={priceLines}
              countdown={`${mm}:${ss}`}
              next={next}
            />
            {step < 6 && (
              <div className="mt-7 flex justify-end">
                <Button size="lg" onClick={next}>
                  Continue <ArrowRight />
                </Button>
              </div>
            )}
          </div>
          {step >= 6 && step < 8 && (
            <aside>
              <Summary
                selected={selected.name}
                detail={
                  plan === "box"
                    ? `${Object.values(itemQty).reduce((sum, count) => sum + count, 0)} items`
                    : size
                }
                term={term}
                date={date}
                service={service}
                slot={slot}
                total={total}
                subtotal={subtotal}
                discount={discount}
                pickupFee={pickupFee}
                parkingFee={parkingFee}
                addressFee={addressFee}
                priceLines={priceLines}
              />
            </aside>
          )}
        </div>
      </div>
    </CustomerShell>
  );
}
function Choice({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border bg-card p-5 text-left transition hover:border-primary/50",
        selected && "border-2 border-primary bg-accent/40",
        className,
      )}
    >
      {children}
    </button>
  );
}
type PriceLine = { label: string; amount: number };
type StepContentProps = {
  step: number;
  plan: string;
  setPlan: (value: string) => void;
  itemQty: Record<string, number>;
  setItemQty: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  size: string;
  setSize: (value: string) => void;
  term: number;
  setTerm: (value: number) => void;
  date: string;
  setDate: (value: string) => void;
  service: string;
  setService: (value: string) => void;
  includeParking: boolean;
  setIncludeParking: (value: boolean) => void;
  differentAddress: boolean;
  setDifferentAddress: (value: boolean) => void;
  slot: string;
  setSlot: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
  total: number;
  subtotal: number;
  discount: number;
  pickupFee: number;
  parkingFee: number;
  addressFee: number;
  priceLines: PriceLine[];
  countdown: string;
  next: () => void;
};
function StepContent(p: StepContentProps) {
  if (p.step === 0)
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((x, i) => (
          <Choice key={x.id} selected={p.plan === x.id} onClick={() => p.setPlan(x.id)}>
            <div className="mb-5 grid size-11 place-items-center rounded-md bg-accent text-primary">
              {i === 0 ? <Box /> : i === 1 ? <Package /> : <Landmark />}
            </div>
            <h2 className="font-display text-xl font-bold">{x.name}</h2>
            <p className="text-sm text-muted-foreground">{x.zh}</p>
            <p className="mt-5 text-2xl font-bold">
              {x.id === "box" ? "From HK$30" : `HK$${x.price}`}
              <span className="text-xs font-normal text-muted-foreground">
                {x.id === "box" ? " / item / month" : ` / ${x.unit}`}
              </span>
            </p>
          </Choice>
        ))}
      </div>
    );
  if (p.step === 1)
    return (
      <div className="max-w-xl">
        <h2 className="mb-2 font-display text-xl font-bold">
          {p.plan === "box" ? "Choose items & quantities" : "Choose your size"}
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">Prices per item, per month</p>
        {p.plan === "box" ? (
          <div className="divide-y rounded-lg border bg-card px-4">
            {boxItems.map((item) => {
              const count = p.itemQty[item.id] ?? 0;
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} · HK${item.price} / item / month
                      {item.promo && (
                        <span className="ml-2 font-medium text-success-strong">Special offer</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Remove one ${item.name}`}
                      disabled={count === 0}
                      onClick={() =>
                        p.setItemQty((current) => ({
                          ...current,
                          [item.id]: Math.max(0, count - 1),
                        }))
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="w-6 text-center font-semibold">{count}</span>
                    <Button
                      size="icon"
                      aria-label={`Add one ${item.name}`}
                      onClick={() =>
                        p.setItemQty((current) => ({ ...current, [item.id]: count + 1 }))
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3">
            {["Small", "Medium", "Large"].map((s, i) => (
              <Choice key={s} selected={p.size === s} onClick={() => p.setSize(s)}>
                <div className="flex justify-between gap-4">
                  <span className="font-bold">{s}</span>
                  <span className="text-right">
                    {[12, 20, 32][i]} sq ft · HK$
                    {(p.plan === "locker" ? unitSizes.locker : unitSizes.room)[i].price} / month
                  </span>
                </div>
              </Choice>
            ))}
          </div>
        )}
      </div>
    );
  if (p.step === 2)
    return (
      <div className="grid max-w-4xl gap-3 sm:grid-cols-4">
        {[1, 3, 6, 12].map((t) => (
          <Choice key={t} selected={p.term === t} onClick={() => p.setTerm(t)}>
            <p className="font-display text-2xl font-bold">
              {t} month{t > 1 ? "s" : ""}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t === 1
                ? "Maximum flexibility"
                : t >= fees.promoMinTerm
                  ? "Save 5% on storage"
                  : "Short-term storage"}
            </p>
          </Choice>
        ))}
      </div>
    );
  if (p.step === 3)
    return (
      <div className="max-w-lg">
        <label className="mb-2 block text-sm font-semibold">Rental start date</label>
        <input
          type="date"
          value={p.date}
          onChange={(e) => p.setDate(e.target.value)}
          className="h-12 w-full rounded-md border bg-card px-4 text-base"
        />
        <p className="mt-3 text-sm text-muted-foreground">The first available date is tomorrow.</p>
      </div>
    );
  if (p.step === 4)
    return (
      <div className="max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {["Pickup", "Drop-off"].map((x, i) => (
            <Choice key={x} selected={p.service === x} onClick={() => p.setService(x)}>
              <div className="mb-4 grid size-11 place-items-center rounded-md bg-accent text-primary">
                {i === 0 ? <Truck /> : <Package />}
              </div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">{x}</h2>
                <span className="font-semibold">
                  {i === 0 ? `+HK$${fees.pickup}` : "No charge"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {i === 0
                  ? "We collect from your address."
                  : "Bring items to our Kwun Tong hub. Parking fee applies."}
              </p>
            </Choice>
          ))}
        </div>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-card px-4 py-3 text-sm">
          <span>
            <span className="block font-medium">Include parking fee</span>
            <span className="text-muted-foreground">
              Added when delivery access requires parking
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 font-semibold">
            +HK${fees.parking}
            <input
              type="checkbox"
              checked={p.includeParking}
              onChange={(event) => p.setIncludeParking(event.target.checked)}
              className="size-4 accent-primary"
            />
          </span>
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-card px-4 py-3 text-sm">
          <span>
            <span className="block font-medium">Different final retrieval address</span>
            <span className="text-muted-foreground">One-time address update admin fee</span>
          </span>
          <span className="flex shrink-0 items-center gap-3 font-semibold">
            +HK${fees.differentAddress}
            <input
              type="checkbox"
              checked={p.differentAddress}
              onChange={(event) => p.setDifferentAddress(event.target.checked)}
              className="size-4 accent-primary"
            />
          </span>
        </label>
      </div>
    );
  if (p.step === 5)
    return (
      <div className="max-w-2xl">
        <p className="mb-4 text-sm text-muted-foreground">
          <CalendarDays className="mr-2 inline size-4" />
          Friday, 2 October 2026
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map((x) => (
            <button
              key={x.time}
              disabled={!x.available}
              onClick={() => p.setSlot(x.time)}
              className={cn(
                "rounded-lg border p-4 text-left",
                !x.available && "cursor-not-allowed bg-muted opacity-55",
                p.slot === x.time && x.available && "border-2 border-primary bg-accent/50",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{x.time}</span>
                {p.slot === x.time && x.available && <Check className="size-4 text-primary" />}
              </div>
              <p
                className={cn(
                  "mt-1 text-xs",
                  x.available ? "text-success-strong" : "text-destructive",
                )}
              >
                {x.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  if (p.step === 6)
    return (
      <div>
        <h2 className="font-display text-xl font-bold">Everything look right?</h2>
        <p className="mt-2 text-muted-foreground">
          Confirm the details before proceeding to payment.
        </p>
        <Button className="mt-7" size="lg" onClick={p.next}>
          Proceed to payment <ShieldCheck />
        </Button>
      </div>
    );
  if (p.step === 7)
    return (
      <div className="max-w-2xl">
        <div className="mb-5 flex items-center gap-3 rounded-md bg-warning-soft p-4 text-sm text-warning-strong">
          <Clock3 className="size-5" />
          <span>
            Your reservation expires in <strong>{p.countdown}</strong>
          </span>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Secure checkout</p>
              <h2 className="font-display text-3xl font-bold">HK${formatMoney(p.total)}</h2>
            </div>
            <ShieldCheck className="text-success-strong" />
          </div>
          <PriceBreakdown {...p} />
          <p className="mb-3 text-sm font-semibold">Payment method</p>
          <div className="grid grid-cols-2 gap-3">
            {["Octopus", "FPS", "AlipayHK", "WeChat Pay HK"].map((m, i) => (
              <Choice
                className="p-4"
                key={m}
                selected={p.method === m}
                onClick={() => p.setMethod(m)}
              >
                <div className="flex items-center gap-2">
                  {i === 0 ? (
                    <CreditCard className="text-warning-strong" />
                  ) : i === 1 ? (
                    <Banknote className="text-info-strong" />
                  ) : (
                    <Smartphone className="text-success-strong" />
                  )}
                  <span className="font-bold">{m}</span>
                </div>
              </Choice>
            ))}
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={p.next}>
            Pay HK${formatMoney(p.total)}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Simulation only — no payment will be taken
          </p>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-success-soft text-success-strong">
        <CheckCircle2 className="size-10" />
      </span>
      <p className="mt-6 text-sm font-semibold text-success-strong">PAYMENT RECEIVED</p>
      <h2 className="mt-2 font-display text-3xl font-bold">Your storage is booked.</h2>
      <p className="mt-3 text-muted-foreground">
        Booking <strong>BH-25104</strong> is confirmed. A sample confirmation has been added to your
        portal.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link to="/portal">View my booking</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
type SummaryProps = {
  selected: string;
  detail: string;
  term: number;
  date: string;
  service: string;
  slot: string;
  total: number;
  subtotal: number;
  discount: number;
  pickupFee: number;
  parkingFee: number;
  addressFee: number;
  priceLines: PriceLine[];
};
function PriceBreakdown(
  p: Pick<
    SummaryProps,
    "subtotal" | "discount" | "pickupFee" | "parkingFee" | "addressFee" | "priceLines"
  >,
) {
  return (
    <div className="mb-5 mt-5 border-y py-4">
      <h3 className="mb-3 text-sm font-semibold">Cost details</h3>
      <dl className="space-y-2 text-sm">
        {p.priceLines.map((line) => (
          <div key={line.label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{line.label}</dt>
            <dd className="shrink-0">HK${line.amount.toFixed(2)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Storage subtotal</dt>
          <dd>HK${p.subtotal.toFixed(2)}</dd>
        </div>
        {p.discount > 0 && (
          <div className="flex justify-between gap-3 text-success-strong">
            <dt>Special offer · 5% off</dt>
            <dd>− HK${p.discount.toFixed(2)}</dd>
          </div>
        )}
        {p.pickupFee > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Pickup service</dt>
            <dd>HK${p.pickupFee.toFixed(2)}</dd>
          </div>
        )}
        {p.parkingFee > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Parking fee</dt>
            <dd>HK${p.parkingFee.toFixed(2)}</dd>
          </div>
        )}
        {p.addressFee > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Different retrieval address</dt>
            <dd>HK${p.addressFee.toFixed(2)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
function Summary(p: SummaryProps) {
  return (
    <Card className="sticky top-24 rounded-lg shadow-sm">
      <CardContent className="p-5">
        <h3 className="font-display text-lg font-bold">Booking summary</h3>
        <dl className="mt-5 space-y-3 text-sm">
          {[
            ["Plan", p.selected],
            ["Selection", p.detail],
            ["Term", `${p.term} months`],
            ["Start", p.date],
            ["Service", p.service],
            ["Time", p.slot],
          ].map(([a, b]) => (
            <div key={a} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{a}</dt>
              <dd className="text-right font-medium">{b}</dd>
            </div>
          ))}
        </dl>
        <PriceBreakdown {...p} />
        <div>
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold">HK${formatMoney(p.total)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">All prices in HKD</p>
        </div>
        <div className="mt-4 space-y-1.5 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          <p>Special price includes initial delivery + final collection only.</p>
          <p>
            Interim access/final retrieval: HK${fees.interimBase} base + HK${fees.interimPerBox}/box
            + HK${fees.interimParking} parking per trip.
          </p>
          <p>Different final retrieval address: +HK${fees.differentAddress} admin fee.</p>
        </div>
      </CardContent>
    </Card>
  );
}
