// components/measurements/measurement-form.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface MeasurementFormProps {
  clerkId: string;
  onSuccess?: () => void;
}

const measurementFields = [
  { key: "neck", label: "Neck", group: "upper" },
  { key: "chest", label: "Chest", group: "upper" },
  { key: "waist", label: "Waist", group: "upper" },
  { key: "hips", label: "Hips", group: "upper" },
  { key: "shoulderWidth", label: "Shoulder Width", group: "upper" },
  { key: "sleeveLength", label: "Sleeve Length", group: "upper" },
  { key: "armhole", label: "Armhole", group: "upper" },
  { key: "inseam", label: "Inseam", group: "lower" },
  { key: "outseam", label: "Outseam", group: "lower" },
  { key: "thigh", label: "Thigh", group: "lower" },
  { key: "knee", label: "Knee", group: "lower" },
  { key: "ankle", label: "Ankle", group: "lower" },
  { key: "rise", label: "Rise", group: "lower" },
  { key: "height", label: "Height", group: "full" },
  { key: "weight", label: "Weight (kg)", group: "full" },
];

export function MeasurementForm({ clerkId, onSuccess }: MeasurementFormProps) {
  const [profileName, setProfileName] = useState("");
  const [unit, setUnit] = useState<"cm" | "inch">("cm");
  const [measurements, setMeasurements] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const createProfile = useMutation(api.measurements.createMeasurementProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProfile({
        clerkId,
        profileName,
        measurements,
        unit,
        notes,
        isDefault,
      });

      // Reset form
      setProfileName("");
      setMeasurements({});
      setNotes("");
      setIsDefault(false);

      onSuccess?.();
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  const updateMeasurement = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setMeasurements((prev) => ({ ...prev, [key]: numValue }));
    } else {
      const { [key]: _, ...rest } = measurements;
      setMeasurements(rest);
    }
  };

  const groups = {
    upper: measurementFields.filter((f) => f.group === "upper"),
    lower: measurementFields.filter((f) => f.group === "lower"),
    full: measurementFields.filter((f) => f.group === "full"),
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            New Measurement Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g., Default, Formal Events, Casual"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Unit</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={unit === "cm" ? "default" : "outline"}
                  onClick={() => setUnit("cm")}
                >
                  Centimeters
                </Button>
                <Button
                  type="button"
                  variant={unit === "inch" ? "default" : "outline"}
                  onClick={() => setUnit("inch")}
                >
                  Inches
                </Button>
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">Set as default</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Upper Body</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {groups.upper.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements[field.key] || ""}
                    onChange={(e) => updateMeasurement(field.key, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder={`in ${unit}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Lower Body</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {groups.lower.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements[field.key] || ""}
                    onChange={(e) => updateMeasurement(field.key, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder={`in ${unit}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">General</h3>
            <div className="grid grid-cols-2 gap-4">
              {groups.full.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements[field.key] || ""}
                    onChange={(e) => updateMeasurement(field.key, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              placeholder="Any special notes about fit preferences..."
            />
          </div>

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}