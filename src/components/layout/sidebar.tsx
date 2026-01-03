// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Package,
  Scissors,
  CalendarCheck,
  Bell,
} from "lucide-react";
import { UserRole } from "@/convex/schema";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["customer", "worker", "manager", "admin"],
  },
  {
    title: "Styles",
    href: "/styles",
    icon: Scissors,
    roles: ["customer", "worker", "manager", "admin"],
  },
  {
    title: "My Orders",
    href: "/orders",
    icon: ShoppingBag,
    roles: ["customer"],
  },
  {
    title: "All Orders",
    href: "/orders/all",
    icon: Package,
    roles: ["manager", "admin"],
  },
  {
    title: "My Tasks",
    href: "/tasks",
    icon: CalendarCheck,
    roles: ["worker"],
  },
  {
    title: "Workshop",
    href: "/workshop",
    icon: Users,
    roles: ["worker", "manager", "admin"],
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    roles: ["customer", "worker", "manager", "admin"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["customer", "worker", "manager", "admin"],
  },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-heading font-bold">Tailoring Pro</h1>
      </div>

      <nav className="space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
