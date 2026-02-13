import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Fabrico
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border/70 bg-muted/20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-10">
          <div>
            <h3 className="text-lg font-semibold">Fabrico</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Modern tailoring operations software with security-first production defaults.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Role-based access controls
            </p>
            <p className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Real-time workflow visibility
            </p>
          </div>
          <div className="text-sm text-muted-foreground lg:text-right">
            © {new Date().getFullYear()} Fabrico. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
