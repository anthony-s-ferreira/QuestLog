import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CampaignEventsProps {
  campaignId: number
}

export function CampaignEvents({ campaignId }: CampaignEventsProps) {
  // This would normally fetch data from the API based on campaignId
  const events = [
    {
      id: 1,
      title: "Battle with the Dragon",
      description: "The party faced off against the ancient red dragon Infernus.",
      character: "Thorne Ironheart",
      characterId: 1,
      date: "2023-12-15",
      type: "Combat",
    },
    {
      id: 2,
      title: "Discovery of the Ancient Artifact",
      description: "Elara discovered the Staff of Arcane Might in the ruins.",
      character: "Elara Moonwhisper",
      characterId: 2,
      date: "2023-12-15",
      type: "Discovery",
    },
    {
      id: 3,
      title: "Meeting with the King",
      description: "The party was granted an audience with King Aldric III.",
      character: "Seraphina Lightbringer",
      characterId: 4,
      date: "2023-12-08",
      type: "Roleplay",
    },
    {
      id: 4,
      title: "Infiltration of the Thieves' Guild",
      description: "Zephyr successfully infiltrated the local thieves' guild.",
      character: "Zephyr Shadowstep",
      characterId: 5,
      date: "2023-12-01",
      type: "Stealth",
    },
    {
      id: 5,
      title: "Defense of the Village",
      description: "Grimm led the defense of Riverdale against goblin raiders.",
      character: "Grimm Stonebreaker",
      characterId: 3,
      date: "2023-11-24",
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={event.character} />
                  <AvatarFallback>{event.character.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{event.character}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
              </div>
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

