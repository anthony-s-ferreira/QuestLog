import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CharacterEventsProps {
  characterId: number
}

export function CharacterEvents({ characterId }: CharacterEventsProps) {
  // This would normally fetch data from the API based on characterId
  const events = [
    {
      id: 1,
      title: "Battle with the Dragon",
      description:
        "Thorne faced off against the ancient red dragon Infernus, landing the killing blow with his warhammer.",
      date: "2023-12-15",
      type: "Combat",
    },
    {
      id: 6,
      title: "Oath of Vengeance",
      description: "After the fall of his companion, Thorne swore an oath of vengeance against the cult of Orcus.",
      date: "2023-12-08",
      type: "Roleplay",
    },
    {
      id: 12,
      title: "Discovery of Dwarven Ruins",
      description: "Thorne discovered ancient dwarven ruins that may hold clues to his clan's lost history.",
      date: "2023-12-01",
      type: "Discovery",
    },
    {
      id: 18,
      title: "Healing the Village",
      description: "Thorne used his divine powers to cure a plague affecting the village of Greenfield.",
      date: "2023-11-24",
      type: "Roleplay",
    },
    {
      id: 24,
      title: "Duel with the Dark Knight",
      description: "Thorne challenged the Dark Knight to single combat to protect his companions.",
      date: "2023-11-17",
      type: "Combat",
    },
  ]

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{event.title}</CardTitle>
              <Badge>{event.type}</Badge>
            </div>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/events/${event.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Event Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

