// app/(dashboard)/customer/orders/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function NewOrderPage() {
  const { user } = useUser();
  const router = useRouter();
  const clerkId = user?.id ?? "";
  const searchParams = useSearchParams();
  const styleId = searchParams.get("styleId");

  const [selectedStyleId, setSelectedStyleId] = useState<Id<"styles"> | null>(
    styleId as Id<"styles"> | null
  );
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<Id<"measurementProfiles"> | null>(null);
  const [fabricSource, setFabricSource] = useState<"inventory" | "customer_provided">("customer_provided");
  const [urgency, setUrgency] = useState<"standard" | "rush" | "express">("standard");
  const [customerNotes, setCustomerNotes] = useState("");

  const styles = useQuery(api.styles.getStyles, clerkId ? { clerkId } : "skip");
  const measurements = useQuery(api.measurements.getMeasurementProfiles, clerkId ? { clerkId } : "skip");
  const selectedStyle = useQuery(
    api.styles.getStyleById,
    selectedStyleId ? { styleId: selectedStyleId } : "skip"
  );

  const createOrder = useMutation(api.orders.createOrder);

  useEffect(() => {
    if (measurements && measurements.length > 0 && !selectedMeasurementId) {
      const defaultProfile = measurements.find((m) => m.isDefault);
      if (defaultProfile) {
        setSelectedMeasurementId(defaultProfile._id);
      }
    }
  }, [measurements, selectedMeasurementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMeasurementId) {
      alert("Please select a measurement profile");
      return;
    }

    try {
      const result = await createOrder({
        clerkId,
        styleId: selectedStyleId || undefined,
        fabricSource,
        measurementProfileId: selectedMeasurementId,
        urgency,
        customerNotes: customerNotes || undefined,
      });

      router.push(`/customer/orders/${result.orderId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order");
    }
  };

  const urgencyPricing = {
    standard: 1,
    rush: 1.5,
    express: 2,
  };

  const estimatedPrice = selectedStyle
    ? selectedStyle.basePrice * urgencyPricing[urgency]
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/styles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold">Create New Order</h1>
          <p className="text-muted-foreground">Select style and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Select Style</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStyle ? (
                  <div className="flex items-start gap-4 p-4 rounded-lg border">
                    <img
                      src={selectedStyle.images[0] || "/placeholder.jpg"}
                      alt={selectedStyle.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedStyle.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {selectedStyle.description}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        ₦{selectedStyle.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStyleId(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse and select a style from our catalog
                    </p>
                    <Link href="/styles">
                      <Button type="button" variant="outline">
                        Browse Styles
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Select Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {measurements?.map((profile) => (
                  <div
                    key={profile._id}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      selectedMeasurementId === profile._id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedMeasurementId(profile._id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{profile.profileName}</h3>
                      {profile.isDefault && <Badge>Default</Badge>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {Object.entries(profile.measurements)
                        .filter(([_, value]) => value !== undefined)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key}>
                            <p className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="font-medium">
                              {value} {profile.unit}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                {measurements?.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No measurement profiles yet
                    </p>
                    <Link href="/measurements">
                      <Button type="button" variant="outline">
                        Create Measurement Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fabric Source</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        fabricSource === "customer_provided"
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setFabricSource("customer_provided")}
                    >
                      <p className="font-medium">I'll Provide Fabric</p>
                      <p className="text-sm text-muted-foreground">
                        Bring your own material
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        fabricSource === "inventory"
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setFabricSource("inventory")}
                    >
                      <p className="font-medium">Use Your Fabric</p>
                      <p className="text-sm text-muted-foreground">
                        Select from inventory
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(["standard", "rush", "express"] as const).map((option) => (
                      <div
                        key={option}
                        className={`p-4 rounded-lg border cursor-pointer transition ${
                          urgency === option
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setUrgency(option)}
                      >
                        <p className="font-medium capitalize">{option}</p>
                        <p className="text-sm text-muted-foreground">
                          {option === "standard" && "14 days"}
                          {option === "rush" && "7 days"}
                          {option === "express" && "3 days"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {urgencyPricing[option]}x price
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStyle && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Base Price</span>
                      <span>₦{selectedStyle.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Urgency Multiplier</span>
                      <span>{urgencyPricing[urgency]}x</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Estimated Total</span>
                        <span>₦{estimatedPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedStyleId || !selectedMeasurementId}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Place Order
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You'll be able to make payment after order confirmation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
