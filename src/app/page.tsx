import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Rocket, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Operations Command Center",
    description:
      "Track orders, measurements, workers, and delivery status in one real-time view with role-based workflows.",
    icon: Workflow,
  },
  {
    title: "Production-Grade Security",
    description:
      "Hardened webhook verification, secure headers, strict auth boundaries, and safer defaults for production deployments.",
    icon: ShieldCheck,
  },
  {
    title: "Customer Experience at Scale",
    description:
      "Premium storefront design, faster page load, and conversion-focused CTA flow for modern tailoring brands.",
    icon: Sparkles,
  },
];

const metrics = [
  { label: "Order throughput", value: "+38%" },
  { label: "Payment reliability", value: "99.9%" },
  { label: "Time to dispatch", value: "-27%" },
  { label: "Platform uptime target", value: "99.95%" },
];

const checklist = [
  "Defense-in-depth request protections",
  "Cryptographic webhook validation",
  "Enterprise-inspired visual system",
  "Mobile-first, accessibility-aware layout",
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(212,37,82,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_35%)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Fabrico
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Request access</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Rocket className="h-4 w-4" />
            Built for premium tailoring teams
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
            Modern tailoring operations, <span className="text-primary">secured for production</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Fabrico now ships with an elevated UI language and security-first runtime posture so your brand looks elite while your infrastructure stays resilient.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Launch your workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View pricing
              </Button>
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-md border border-border/80 bg-card/70 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-primary" />
              Security posture snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border/70 bg-card/80 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="border-border/70 bg-card/75 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Icon className="mb-4 h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
