import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing and using Fabrico, you agree to these terms and our platform usage standards.",
  },
  {
    title: "2. License",
    body: "We grant you a limited, non-transferable license to use Fabrico for tailoring business operations.",
  },
  {
    title: "3. Account responsibilities",
    body: "You are responsible for account security, user permissions, and all actions performed by your team.",
  },
  {
    title: "4. Billing",
    body: "Subscriptions are billed in advance on a monthly or annual basis, subject to local legal requirements.",
  },
  {
    title: "5. Service limitations",
    body: "Fabrico is provided as-is and we are not liable for indirect or consequential damages to the extent permitted by law.",
  },
  {
    title: "6. Termination",
    body: "We may suspend or terminate accounts that violate platform rules, security policies, or applicable law.",
  },
  {
    title: "7. Contact",
    body: "For legal questions, contact legal@fabrico.app.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Terms & Conditions</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        These terms govern your use of Fabrico products and services. Please review regularly as they may be updated.
      </p>

      <div className="mt-8 space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="border-border/70">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
