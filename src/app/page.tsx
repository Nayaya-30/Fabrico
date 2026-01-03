// app/(marketing)/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scissors,
  Users,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare,
  BarChart3,
  Smartphone,
  Check,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scissors className="h-8 w-8 text-primary" />
              <span className="text-xl font-heading font-bold">Tailoring Pro</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition">
                Testimonials
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary transition">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-slide-down">
              <Link href="#features" className="block py-2 text-sm font-medium">
                Features
              </Link>
              <Link href="#pricing" className="block py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="block py-2 text-sm font-medium">
                Testimonials
              </Link>
              <Link href="#contact" className="block py-2 text-sm font-medium">
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Transform Your Tailoring Business
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Professional Tailoring
            <br />
            Management Platform
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Streamline your tailoring business with our all-in-one platform. Manage orders,
            track progress, coordinate teams, and delight customers with real-time updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for tailoring businesses of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business size
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-xl scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Trusted by Tailors Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of tailors who have streamlined their operations with Tailoring Pro
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-6 w-6 text-primary" />
                <span className="text-lg font-heading font-bold">Tailoring Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional tailoring management platform for modern businesses
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="#">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#contact">Contact</Link></li>
                <li><Link href="#">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Tailoring Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Scissors,
    title: "Style Showcase",
    description: "Beautiful gallery to showcase your work and inspire customers with your best designs",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Assign tasks, track workload, and manage your entire workshop from one dashboard",
  },
  {
    icon: TrendingUp,
    title: "Order Tracking",
    description: "Real-time order progress updates keep customers informed at every stage",
  },
  {
    icon: MessageSquare,
    title: "Built-in Chat",
    description: "Communicate seamlessly with team members and customers directly in the platform",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Insights on revenue, performance, and business growth at your fingertips",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Access your business from anywhere with our responsive mobile interface",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Integrated payment processing with Paystack and Flutterwave",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Instant notifications keep everyone in sync across your entire operation",
  },
];

const steps = [
  {
    title: "Sign Up",
    description: "Create your account in less than 2 minutes. No credit card required for trial.",
  },
  {
    title: "Set Up",
    description: "Add your styles, team members, and customize your workspace preferences.",
  },
  {
    title: "Grow",
    description: "Start accepting orders, managing your workshop, and delighting customers.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for individual tailors",
    price: "₦15,000",
    period: "month",
    cta: "Start Free Trial",
    features: [
      "Up to 50 orders/month",
      "Style gallery",
      "Customer portal",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Professional",
    description: "For growing businesses",
    price: "₦35,000",
    period: "month",
    popular: true,
    cta: "Start Free Trial",
    features: [
      "Unlimited orders",
      "Team management (up to 10)",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Payment integration",
    ],
  },
  {
    name: "Enterprise",
    description: "For large operations",
    price: "Custom",
    cta: "Contact Sales",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
    ],
  },
];

const testimonials = [
  {
    name: "Amara Johnson",
    role: "Fashion Designer, Lagos",
    quote: "This platform transformed how I run my business. My customers love the real-time updates!",
  },
  {
    name: "Chidi Okafor",
    role: "Tailor Shop Owner",
    quote: "Managing my team has never been easier. The workload tracker is a game-changer.",
  },
  {
    name: "Fatima Hassan",
    role: "Bespoke Tailoring",
    quote: "The analytics help me make better business decisions. Highly recommended!",
  },
];