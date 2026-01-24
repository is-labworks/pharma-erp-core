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
  const { user, isAuthenticated, switchRole, logout } = useAuth()
  const [currentRole, setCurrentRole] = React.useState<UserRole>(role)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  React.useEffect(() => {
    if (user) {
      setCurrentRole(user.role)
    }
  }, [user])

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole)
    switchRole(newRole)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar
        role={currentRole}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }}
        onRoleChange={handleRoleChange}
        onLogout={logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbSeparator />
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
          <div className="ml-auto text-sm text-muted-foreground">{roleLabels[currentRole]}</div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
