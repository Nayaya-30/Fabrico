
// app/(dashboard)/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Save,
  Check,
} from "lucide-react";

interface AdminSettingsPageProps {
  clerkId: string;
}

export default function AdminSettingsPage({ clerkId }: AdminSettingsPageProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "payments", label: "Payment Providers", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-6">
        <Card className="h-fit">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name
                  </label>
                  <Input defaultValue="Tailoring Pro" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Email
                  </label>
                  <Input defaultValue="support@tailoringpro.com" type="email" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Support Phone
                  </label>
                  <Input defaultValue="+234 XXX XXX XXXX" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Address
                  </label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                    defaultValue="123 Fashion Street, Lagos, Nigeria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Currency
                  </label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <Button onClick={handleSave}>
                  {saved ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Provider Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">💳</div>
                      <div>
                        <h3 className="font-semibold">Paystack</h3>
                        <p className="text-sm text-muted-foreground">
                          Nigerian payment gateway
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Public Key
                      </label>
                      <Input
                        type="password"
                        defaultValue="pk_test_xxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Secret Key
                      </label>
                      <Input
                        type="password"
                        defaultValue="sk_test_xxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="paystack-test" defaultChecked />
                      <label htmlFor="paystack-test" className="text-sm">
                        Test Mode
                      </label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}