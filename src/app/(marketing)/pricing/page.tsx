import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "₦15,000",
    period: "month",
    description: "For solo tailors starting to scale",
    features: ["Up to 50 orders/month", "Style gallery", "Client portal", "Basic analytics", "Email support"],
  },
  {
    name: "Professional",
    price: "₦35,000",
    period: "month",
    popular: true,
    description: "For fast-growing tailoring operations",
    features: [
      "Unlimited orders",
      "Team workflows (up to 10)",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Payment integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-workshop brands",
    features: [
      "Everything in Professional",
      "Unlimited seats",
      "Dedicated success lead",
      "Custom integrations",
      "SLA + security reviews",
      "Compliance support",
    ],
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start quickly, then scale confidently. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "relative border-primary shadow-xl" : "border-border/70"}>
            {plan.popular ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Recommended
              </span>
            ) : null}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <div className="pt-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                {plan.period ? <span className="text-muted-foreground">/{plan.period}</span> : null}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 pb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                  Get started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
