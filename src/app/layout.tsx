// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: dark, // or undefined for light
            variables: {
              colorPrimary: "hsl(346 77% 50%)",
              colorBackground: "hsl(240 10% 3.9%)",
              colorInputBackground: "hsl(240 3.7% 15.9%)",
              colorInputText: "hsl(0 0% 98%)",
            },
          }}
        >
          <ConvexClientProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
