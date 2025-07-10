"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Menu, Leaf, Home, Upload, Sliders, Database, ClipboardCheck, Bell, LogOut, Building, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image";

const company = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analysis", href: "/analysis", icon: Leaf },
  { name: "TradeOff Simulator", href: "/trade-off-simulator", icon: Sliders },
  { name: "Monitoring", href: "/monitoring", icon: Bell },
  { name: "Suppliers Directory", href: "/supplierdirectory", icon: Bell },
  { name: "Actions", href: "/actions", icon: Bell },
]

const supplier = [
  { name: "Home", href: "/", icon: Home },
  { name: "Data Submission", href: "/data-submission", icon: Upload },
  { name: "Score-Analysis", href: "/analysis", icon: Leaf },
  { name: "Actions", href: "/assessment", icon: ClipboardCheck },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const { userData, isAuthenticated } = useAuth() // Using our hook

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  useEffect(() => {
    // Only redirect to guidance if user is authenticated and not already on guidance page
    if (isAuthenticated && userData && pathname !== "/guidance") {
      const guidanceKey = `guidance_completed_${userData.email}_${userData.role}`
      const guidanceCompleted = localStorage.getItem(guidanceKey)

      console.log("Navigation: Checking guidance for user:", userData.email, "Completed:", guidanceCompleted)

      if (guidanceCompleted !== "true") {
        console.log("Navigation: Redirecting to guidance")
        router.push("/guidance")
      }
    }
  }, [isAuthenticated, userData, pathname, router])


  const handleLogout = () => {
    router.push("/logout")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }


  // Don't render if not authenticated
  // if (!isAuthenticated) {
  //   return null
  // }
  // Don't render navigation on registration, login, or logout pages
  if (pathname === "/registration" || pathname === "/login" || pathname === "/logout" || pathname === "/guidance") {
    return null
  }

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm dark:bg-[#0f0f0f]/80"
          : "bg-background/80 backdrop-blur-md dark:bg-gradient-to-r dark:from-[#0f0f0f]/90 dark:to-[#1a1a1a]/90"
      )}
    >

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Leaf className="h-8 w-8 text-[#E2142D] transition-transform group-hover:scale-110" />

              <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-r from-[#E2142D] to-[#E2142D] bg-clip-text text-transparent">
              ProcurePro
            </span>
            {/* <div className="absolute inset-0 h-16 w-16 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" /> */}
            {/* Tech Mahindra Logo */}
            <Image
              src="/techm.png"
              alt="Tech Mahindra"
              width={64}
              height={64}
              className="ml-10 h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {(userData?.role === "Supplier" ? supplier : company).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-all duration-200 hover:text-primary",
                  pathname === item.href
                    ? "text-[#E2142D] font-semibold dark:text-[#E2142D]"
                    : "text-foreground/90 hover:text-foreground dark:hover:text-[#a21caf]"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User Profile and Theme Toggle */}
          <div className="flex items-center space-x-4">

            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="  bg-primary/10 text-primary font-semibold
              dark:bg-[#a21caf]/10 dark:text-[#a21caf]
">
                        {userData?.email?.charAt(0)?.toUpperCase() ?? ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  {/* ... keep your existing popover content */}
                  <Link href="/profile" >
                    <Button variant="outline" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href="/auth">
                <Button className="px-6 h-11  bg-gradient-to-r from-[#E2142D] to-[#2563eb] hover:from-[#E2142D]/90 hover:to-[#2563eb]/80 transition-all duration-300 hover:shadow-xl font-bold text-white text-sm tracking-wide shadow-lg">
                  Get Started

                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <MobileNav userData={userData} onLogout={handleLogout} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileNav({ onLogout }: { userData: any; onLogout: () => void }) {
  const pathname = usePathname()
  const { userData, isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col space-y-6 mt-8">
      <Link href="/" className="flex items-center space-x-2">
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-heading font-bold text-lg bg-gradient-to-r from-[#E2142D] via-[#2563eb] to-[#a21caf] bg-clip-text text-transparent">
          ProcurePro
        </span>
      </Link>

      {userData && (
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userData?.email
                ? userData.email
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                : "?"}
            </AvatarFallback>

          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{userData.email}</h4>
            <p className="text-xs text-muted-foreground">{userData.role}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {(userData?.role === "Supplier" ? supplier : company).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-[#E2142D]/10 text-[#E2142D] dark:text-[#E2142D]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      {userData && (
        <Button onClick={onLogout} className="w-full justify-start bg-white text-[#E2142D] dark:bg-[#E2142D]/10 dark:text-[#E2142D] hover:opacity-90">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      )}
    </div>
  )
}