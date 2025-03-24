"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, CalendarDays, Home, Scroll, Settings, Shield, Users, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext";

interface DashboardSidebarProps {
  setOpen?: (open: boolean) => void
}

export function DashboardSidebar({ setOpen }: DashboardSidebarProps) {
  const { user, signIn, signOut, isAdmin } = useAuth();

  const pathname = usePathname()
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  useEffect(() => {
    setUserIsAdmin(isAdmin())
  }, [])

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Campaigns",
      icon: Scroll,
      href: "/dashboard/campaigns",
    },
    {
      label: "Characters",
      icon: Users,
      href: "/dashboard/characters",
    },
    // {
    //   label: "Events",
    //   icon: CalendarDays,
    //   href: "/dashboard/events",
    // },
    {
      label: "Event Types",
      icon: BookOpen,
      href: "/dashboard/event-types",
    },
  ]

  const adminRoutes = [
    {
      label: "Admin Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      label: "Users",
      icon: User,
      href: "/dashboard/admin/users",
    },
    {
      label: "Campaigns",
      icon: Scroll,
      href: "/dashboard/admin/campaigns",
    },
    {
      label: "Characters",
      icon: Users,
      href: "/dashboard/admin/characters",
    },
    {
      label: "Events",
      icon: CalendarDays,
      href: "/dashboard/admin/events",
    },
    {
      label: "Event Types",
      icon: BookOpen,
      href: "/dashboard/admin/event-types",
    },
  ]

  const filteredRoutes = routes.filter((route) => !route.adminOnly || (route.adminOnly && userIsAdmin))

  return (
    <div className="flex h-full w-10% flex-col border-r bg-muted/40">

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {filteredRoutes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setOpen?.(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-muted",
                  route.adminOnly && "text-yellow-600 dark:text-yellow-400",
                )}
              >
                {route.adminOnly ? <Shield className="mr-2 h-5 w-5" /> : <route.icon className="mr-2 h-5 w-5" />}
                {route.label}
                {route.adminOnly && (
                  <span className="ml-auto rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Admin
                  </span>
                )}
              </Button>
            </Link>
          ))}

          {userIsAdmin && (
            <>
              <div className="my-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-xs font-medium text-muted-foreground">ADMIN</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
              </div>

              {adminRoutes.map((route) => (
                <Link key={route.href} href={route.href} onClick={() => setOpen?.(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-yellow-600 dark:text-yellow-400",
                      pathname === route.href && "bg-muted",
                    )}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

