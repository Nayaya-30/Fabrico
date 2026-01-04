// app/(auth)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scissors, User, Users, Briefcase, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.auth.createUser);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: "",
    role: "customer" as "customer" | "worker" | "manager" | "admin",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      value: "customer" as const,
      icon: User,
      title: "Customer",
      description: "Browse styles and place orders",
      color: "bg-blue-500",
    },
    {
      value: "worker" as const,
      icon: Scissors,
      title: "Tailor/Worker",
      description: "Work on assigned tailoring tasks",
      color: "bg-green-500",
    },
    {
      value: "manager" as const,
      icon: Users,
      title: "Manager",
      description: "Manage team and oversee operations",
      color: "bg-purple-500",
    },
    {
      value: "admin" as const,
      icon: Crown,
      title: "Admin",
      description: "Full system access and control",
      color: "bg-red-500",
    },
  ];

  const roleTextColorMap: Record<typeof roles[number]["value"], string> = {
    customer: "text-blue-500",
    worker: "text-green-500",
    manager: "text-purple-500",
    admin: "text-red-500",
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      // Redirect based on role
      const redirectMap = {
        customer: "/customer/dashboard",
        worker: "/worker/dashboard",
        manager: "/manager/dashboard",
        admin: "/admin/dashboard",
      };

      router.push(redirectMap[formData.role]);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to complete setup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Scissors className="h-10 w-10 text-primary" />
            <span className="text-2xl font-heading font-bold">Tailoring Pro</span>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Just a few steps to get you started
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step {step} of 2</CardTitle>
              <div className="flex gap-2">
                <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+234 XXX XXX XXXX"
                    type="tel"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll use this for order updates and notifications
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Select Your Role <span className="text-destructive">*</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <div
                          key={role.value}
                          onClick={() =>
                            setFormData({ ...formData, role: role.value })
                          }
                          className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                            formData.role === role.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`h-12 w-12 rounded-lg ${role.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                            <Icon className={`h-6 w-6 ${roleTextColorMap[role.value]}`} />
                          </div>
                          <h3 className="font-semibold mb-1">{role.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                          {formData.role === role.value && (
                            <Badge className="mt-3">Selected</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Setting up..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
