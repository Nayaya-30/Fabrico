// app/(dashboard)/layout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";

export default function DashboardLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const convexUser = useQuery(
		api.auth.getCurrentUser,
		user ? { clerkId: user.id } : "skip"
	);

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	if (isLoaded && !user) {
		setTimeout(() => {
			router.replace("/sign-in");
		}, 0);
		return null;
	}

	if (!convexUser) {
		return <div>Setting up your account...</div>;
	}

	return (
		<DashboardLayout
			user={{
				fullName: convexUser.fullName,
				role: convexUser.role,
				clerkId: user.id,
			}}
		>
			{children}
		</DashboardLayout>
	);
}

{/* medium">Total Styles</CardTitle>
//           </CardHeader >
//	<CardContent>
//		<div className="text-2xl font-bold">{styles?.length || 0}</div>
//	</CardContent>
//         </Card >
//       </div >

//	<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//		{filteredStyles?.map((style) => (
//			<Card key={style._id} className="group overflow-hidden">
//				<div className="relative aspect-square bg-muted">
//					<img
//						src={style.images[0] || "/placeholder.jpg"}
//						alt={style.title}
//						className="h-full w-full object-cover"
//					/>
//					<div className="absolute top-2 right-2 flex gap-2">
//						<Badge variant="secondary">{style.category}</Badge>
//					</div>
//				</div>

//				<CardContent className="p-4">
//					<h3 className="font-semibold mb-1 line-clamp-1">{style.title}</h3>
//					<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
//						{style.description}
//					</p>

//					<div className="flex items-center justify-between mb-3">
//						<span className="text-lg font-bold">₦{style.basePrice.toLocaleString()}</span>
//						<div className="flex items-center gap-1 text-sm text-muted-foreground">
//							<TrendingUp className="h-4 w-4" />
//							{style.orders} orders
//						</div>
//					</div>

//					<div className="flex gap-2">
//						<Link href={`/styles/${style._id}`} className="flex-1">
//							<Button variant="outline" size="sm" className="w-full">
//								<Eye className="h-4 w-4 mr-1" />
//								View
//							</Button>
//						</Link>
//						<Button
//							variant="outline"
//							size="sm"
//							onClick={() => window.location.href = `/admin/styles/${style._id}/edit`}
//						>
//							<Edit className="h-4 w-4" />
//						</Button>
//						<Button
//							variant="outline"
//							size="sm"
//							onClick={() => handleDelete(style._id)}
//							className="text-destructive"
//						>
//							<Trash2 className="h-4 w-4" />
//						</Button>
//					</div>
//				</CardContent>
//			</Card>
//		))}
//	</div>

// {
//	filteredStyles?.length === 0 && (
//		<Card>
//			<CardContent className="text-center py-12">
//				<p className="text-muted-foreground">No styles found</p>
//			</CardContent>
//		</Card>
//	)
// }
//     </div >
//   );
// */}
