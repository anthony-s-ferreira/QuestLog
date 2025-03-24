import Link from "next/link"
import { Scroll } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="flex flex-col gap-6 py-8 md:flex-row md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Scroll className="h-6 w-6" />
            <span className="text-lg font-bold">QuestLog</span>
          </Link>
          <p className="text-sm text-muted-foreground">Your tabletop adventures, digitally chronicled.</p>
        </div>
        <div className="flex flex-col gap-2 py-4 md:flex-row md:py-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} QuestLog. All rights reserved.
          </p>
        </div>
      </div>
      
    </footer>
  )
}

