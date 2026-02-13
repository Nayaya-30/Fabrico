import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fabrico | Tailoring Operations Platform",
  description:
    "Production-ready tailoring operations platform with real-time workflows, role-based dashboards, and secure payment orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "hsl(346 77% 50%)",
              colorBackground: "hsl(240 10% 3.9%)",
              colorInputBackground: "hsl(240 3.7% 15.9%)",
              colorInputText: "hsl(0 0% 98%)",
            },
          }}
        >
          <ConvexClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
