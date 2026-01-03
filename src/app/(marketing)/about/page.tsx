// app/(marketing)/about/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading font-bold mb-4">About Tailoring Pro</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering tailoring businesses with modern technology to deliver
            exceptional craftsmanship and customer service
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We believe every tailor deserves access to professional tools that help
              them grow their business and showcase their craftsmanship to the world.
            </p>
            <p className="text-muted-foreground">
              Tailoring Pro was built by tailors, for tailors. We understand the
              unique challenges of managing custom orders, coordinating teams, and
              maintaining the highest standards of quality.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground mb-4">
              To become the world's leading platform for tailoring management,
              connecting skilled artisans with customers who appreciate quality
              craftsmanship.
            </p>
            <p className="text-muted-foreground">
              We're building more than software – we're building a community that
              celebrates the art of tailoring and supports craftspeople in their
              journey to success.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: Users,
              title: "500+ Tailors",
              description: "Trust our platform daily",
            },
            {
              icon: Award,
              title: "50,000+ Orders",
              description: "Successfully completed",
            },
            {
              icon: Globe,
              title: "15 Countries",
              description: "Across Africa & beyond",
            },
            {
              icon: Heart,
              title: "98% Satisfaction",
              description: "Customer rating",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}