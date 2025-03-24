import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Tabletop Adventures, Digitally Chronicled
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    QuestLog helps you manage your tabletop RPG campaigns, characters, and memorable moments in one
                    place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-primary text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="https://github.com/anthony-s-ferreira/QuestLog">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center">
                <Image
                  src="https://camo.githubusercontent.com/9cec4c3910c6cbbd75aac196f08ccdc2db50ce0196eb099958bf39f9a271afa6/68747470733a2f2f692e696d6775722e636f6d2f413332574836642e706e67"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="aspect-square rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your tabletop RPG campaigns
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Campaign Management</h3>
                <p className="text-muted-foreground">
                  Create and manage your RPG campaigns with detailed descriptions, player lists, and session scheduling.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Character Sheets</h3>
                <p className="text-muted-foreground">
                  Build and maintain digital character sheets with customizable attributes, inventory, and backstory.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Event Logging</h3>
                <p className="text-muted-foreground">
                  Record and categorize important campaign events, from epic battles to character development moments.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}

