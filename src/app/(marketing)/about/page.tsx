import { Card, CardContent } from "@/components/ui/card";
import { Award, Globe, Heart, Users } from "lucide-react";

const stats = [
  { icon: Users, title: "500+ Teams", description: "Tailors and ateliers using Fabrico daily" },
  { icon: Award, title: "50,000+ Orders", description: "Managed end-to-end on platform" },
  { icon: Globe, title: "15 Countries", description: "Growing across African fashion hubs" },
  { icon: Heart, title: "98% Satisfaction", description: "From business owners and clients" },
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">About Fabrico</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          We help tailoring businesses operate like modern digital brands.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Fabrico is designed for high-craft teams that need structure, speed, and trust. We connect intake,
          production, team collaboration, and client communication into one secure operating layer.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Card className="bg-card/80">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Our mission</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Give every tailoring business enterprise-grade process control without enterprise complexity.
              From solo specialists to distributed workshops, Fabrico keeps operations measurable and consistent.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Our vision</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Build the default system of record for custom fashion production—where craftsmanship meets reliable,
              secure, and scalable digital execution.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/70 bg-card/75">
            <CardContent className="p-6 text-center">
              <stat.icon className="mx-auto h-9 w-9 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{stat.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
