import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Scroll } from "lucide-react"

export function LandingHeader() {
  return (
    <header className="w-100% border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Scroll className="h-6 w-6" />
          <span className="text-lg font-bold">QuestLog</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

