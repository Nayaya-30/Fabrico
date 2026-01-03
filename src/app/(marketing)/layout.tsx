
// app/(marketing)/layout.tsx
import Link from "next/link";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-8 w-8 text-primary" />
              <span className="text-xl font-heading font-bold">Tailoring Pro</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition">
                About
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary transition">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="pt-16">{children}</div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
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
                <li><Link href="/#features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="#">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#contact">Contact</Link></li>
                <li><Link href="/terms">Terms</Link></li>
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
