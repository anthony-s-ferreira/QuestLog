"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Scroll, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
  const router = useRouter()
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Simulate logout process
    const logoutTimer = setTimeout(() => {
      setIsLoggingOut(false)
      signOut()
      // Start countdown for redirect
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            // Redirect to login page after countdown
            router.push("/login")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }, 1500)

    return () => clearTimeout(logoutTimer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Scroll className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">Logging Out</CardTitle>
          <CardDescription>
            {isLoggingOut
              ? "Please wait while we log you out..."
              : `You have been successfully logged out. Redirecting in ${countdown}...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          {isLoggingOut ? (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <LogOut className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-center text-muted-foreground">
                Thank you for using QuestLog. We hope to see you again soon!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isLoggingOut && (
            <Link href="/login">
              <Button>Return to Login</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

