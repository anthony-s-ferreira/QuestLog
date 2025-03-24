"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronRight, Scroll } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

interface EventListProps {
  searchQuery?: string
  eventTypeFilter?: string
  campaignFilter?: string
  recentOnly?: boolean
  myCharactersOnly?: boolean
}

export function EventList({
  searchQuery = "",
  eventTypeFilter = "all",
  campaignFilter = "all",
  recentOnly = false,
  myCharactersOnly = false,
}: EventListProps) {
  // This would normally fetch data from the API
  const allEvents = [
    {
      id: 1,
      title: "Battle with the Dragon",
      description: "The party faced off against the ancient red dragon Infernus.",
      character: "Thorne Ironheart",
      characterId: 1,
      campaign: "The Forgotten Realms",
      campaignId: 1,
      date: "2023-12-15",
      type: "Combat",
      typeId: "1",
      isMyCharacter: true,
    },
    {
      id: 2,
      title: "Meeting with the Count",
      description: "The party was invited to dinner at Castle Ravenloft.",
      character: "Lyra Moonshadow",
      characterId: 2,
      campaign: "Curse of Strahd",
      campaignId: 2,
      date: "2023-12-10",
      type: "Roleplay",
      typeId: "2",
      isMyCharacter: false,
    },
    {
      id: 3,
      title: "Netrunning the Arasaka Database",
      description: "Zephyr hacked into the corporate database to steal classified information.",
      character: "Zephyr",
      characterId: 3,
      campaign: "Cyberpunk Red",
      campaignId: 3,
      date: "2023-11-28",
      type: "Skill Challenge",
      typeId: "4",
      isMyCharacter: true,
    },
    {
      id: 4,
      title: "Escape from Mos Eisley",
      description: "The crew narrowly escaped Imperial forces after a smuggling job went wrong.",
      character: "Kira Voss",
      characterId: 4,
      campaign: "Star Wars: Edge of the Empire",
      campaignId: 4,
      date: "2023-12-05",
      type: "Adventure",
      typeId: "5",
      isMyCharacter: false,
    },
    {
      id: 5,
      title: "Discovery of the Ancient Artifact",
      description: "Elara discovered the Staff of Arcane Might in the ruins.",
      character: "Elara Moonwhisper",
      characterId: 5,
      campaign: "The Forgotten Realms",
      campaignId: 1,
      date: "2023-12-15",
      type: "Discovery",
      typeId: "3",
      isMyCharacter: false,
    },
    {
      id: 6,
      title: "Oath of Vengeance",
      description: "After the fall of his companion, Thorne swore an oath of vengeance against the cult of Orcus.",
      character: "Thorne Ironheart",
      characterId: 1,
      campaign: "The Forgotten Realms",
      campaignId: 1,
      date: "2023-12-08",
      type: "Roleplay",
      typeId: "2",
      isMyCharacter: true,
    },
  ]

  // Filter events based on props
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.character.toLowerCase().includes(query),
      )
    }

    // Filter by event type
    if (eventTypeFilter && eventTypeFilter !== "all") {
      filtered = filtered.filter((event) => event.typeId === eventTypeFilter)
    }

    // Filter by campaign
    if (campaignFilter && campaignFilter !== "all") {
      filtered = filtered.filter((event) => event.campaignId.toString() === campaignFilter)
    }

    // Filter for recent events only (last 7 days)
    if (recentOnly) {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filtered = filtered.filter((event) => new Date(event.date) >= sevenDaysAgo)
    }

    // Filter for my characters only
    if (myCharactersOnly) {
      filtered = filtered.filter((event) => event.isMyCharacter)
    }

    return filtered
  }, [allEvents, searchQuery, eventTypeFilter, campaignFilter, recentOnly, myCharactersOnly])

  if (filteredEvents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">No events found matching your filters.</p>
          <Button variant="outline" className="mt-4">
            <Link href="/dashboard/events/new">Create New Event</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
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
              <div className="flex items-center gap-2">
                <Scroll className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`/dashboard/campaigns/${event.campaignId}`}
                  className="text-sm text-primary hover:underline"
                >
                  {event.campaign}
                </Link>
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

