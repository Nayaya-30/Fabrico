"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarCheck, Home, MessageSquare, Scissors, Settings, ShoppingBag, Users } from "lucide-react";
import { UserRole } from "@/convex/schema";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home, roles: ["customer", "worker", "manager", "admin"] },
  { title: "Styles", href: "/styles", icon: Scissors, roles: ["customer", "worker", "manager", "admin"] },
  { title: "Orders", href: "/orders", icon: ShoppingBag, roles: ["customer", "manager", "admin"] },
  { title: "Tasks", href: "/tasks", icon: CalendarCheck, roles: ["worker"] },
  { title: "Workshop", href: "/workshop", icon: Users, roles: ["worker", "manager", "admin"] },
  { title: "Messages", href: "/messages", icon: MessageSquare, roles: ["customer", "worker", "manager", "admin"] },
  { title: "Analytics", href: "/admin/dashboard", icon: BarChart3, roles: ["admin"] },
  { title: "Settings", href: "/settings", icon: Settings, roles: ["customer", "worker", "manager", "admin"] },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-border/70 bg-card/80 backdrop-blur-xl lg:block">
      <div className="flex h-16 items-center border-b border-border/70 px-6">
        <h1 className="text-lg font-semibold tracking-tight">Fabrico</h1>
      </div>

      <nav className="space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
