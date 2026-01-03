// app/(dashboard)/customer/measurements/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MeasurementForm } from "@/components/measurements/measurement-form";
import { Plus, Ruler, Edit, Star, Loader2 } from "lucide-react";

interface MeasurementsPageProps {
	clerkId: string;
}

export default function MeasurementsPage({ clerkId }: MeasurementsPageProps) {
	const [showForm, setShowForm] = useState(false);
	const profiles = useQuery(api.measurements.getMeasurementProfiles, { clerkId });

	if (profiles === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-heading font-bold">Measurement Profiles</h1>
					<p className="text-muted-foreground">
						Manage your saved measurements for faster ordering
					</p>
				</div>
				<Button onClick={() => setShowForm(!showForm)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Profile
				</Button>
			</div>

			{showForm && (
				<MeasurementForm
					clerkId={clerkId}
					onSuccess={() => setShowForm(false)}
				/>
			)}

			{profiles.length === 0 ? (
				<Card>
					<CardContent className="text-center py-12">
						<Ruler className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground mb-4">No measurement profiles yet</p>
						<Button onClick={() => setShowForm(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Create Your First Profile
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid md:grid-cols-2 gap-6">
					{profiles.map((profile) => (
						<Card key={profile._id}>
							<CardHeader className="flex flex-row items-center justify-between">
								<div className="flex items-center gap-2">
									<CardTitle>{profile.profileName}</CardTitle>
									{profile.isDefault && (
										<Badge variant="default">
											<Star className="h-3 w-3 mr-1" />
											Default
										</Badge>
									)}
								</div>
								<Button variant="ghost" size="icon">
									<Edit className="h-4 w-4" />
								</Button>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4 text-sm">
									{Object.entries(profile.measurements)
										.filter(([_, value]) => value !== undefined)
										.slice(0, 6)
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
								{profile.notes && (
									<div>
										<p className="text-sm text-muted-foreground">Notes</p>
										<p className="text-sm">{profile.notes}</p>
									</div>
								)}
								<p className="text-xs text-muted-foreground">
									Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
