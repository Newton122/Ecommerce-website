"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Bell, User, Menu, X, ChevronDown, LogOut, Package, Settings, Users, Sun, Moon, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
     <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
              BLACK<span className="text-primary">PHICS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-200 hover:text-primary hover:translate-y-0.5 ${
                  pathname === link.href ? "text-primary" : "text-white/70"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-primary text-black text-[10px] font-bold px-1">
                  {count > 99 ? "99+" : count}
                </Badge>
              )}
            </Link>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-primary transition-all duration-200 hover:scale-110">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                        Mark all read
                      </button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="px-2 py-4 text-center text-white/50 text-sm">No notifications</div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <DropdownMenuItem key={n.id} asChild>
                        <Link
                          href={n.href || "#"}
                          className="flex flex-col items-start gap-1 cursor-pointer"
                          onClick={() => markAllAsRead()}
                        >
                          <span className="text-xs font-semibold text-white">{n.title}</span>
                          <span className="text-xs text-white/60 line-clamp-2">{n.message}</span>
                          <span className="text-[10px] text-white/40">
                            {new Date(n.time).toLocaleString()}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-primary transition-all duration-200 hover:scale-110">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">
                      <Package size={14} className="mr-2" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      <Settings size={14} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Package size={14} className="mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/orders">
                          <Package size={14} className="mr-2" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products">
                          <Package size={14} className="mr-2" />
                          Products
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users">
                          <Users size={14} className="mr-2" />
                          Users
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/analytics">
                          <BarChart3 size={14} className="mr-2" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-400">
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-black transition-all duration-200 hover:bg-primary/90 hover:scale-105"
              >
                Login
              </Link>
            )}

             <button
               className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-primary transition-all duration-200 hover:scale-110"
               onClick={() => setMobileOpen((prev) => !prev)}
             >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.08] py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-semibold py-2 transition-all duration-200 hover:text-primary hover:translate-x-1 ${
                  pathname === link.href ? "text-primary" : "text-white/70"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}                  className="block text-sm font-semibold py-2 text-primary">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
