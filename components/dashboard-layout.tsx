"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { UserRole } from "@/lib/types"
import { roleLabels } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: UserRole
  breadcrumbs?: { label: string; href?: string }[]
}

export function DashboardLayout({ children, role, breadcrumbs = [] }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Use the actual logged-in user's role (not the page's default role prop)
  const activeRole = user.role

  return (
    <SidebarProvider>
      <AppSidebar
        role={activeRole}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }}
        onLogout={logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto text-sm text-muted-foreground">
            {roleLabels[activeRole]}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
