import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronRight } from "lucide-react"
import Link from "next/link"

export function RecentEvents() {
  const events = [
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
    },
  ]

  return (
    // <div className="space-y-4">
    //   {events.map((event) => (
    //     <Card key={event.id}>
    //       <CardHeader>
    //         <div className="flex items-center justify-between">
    //           <CardTitle>{event.title}</CardTitle>
    //           <Badge>{event.type}</Badge>
    //         </div>
    //         <CardDescription>{event.description}</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    //           <div className="flex items-center gap-2">
    //             <Avatar className="h-8 w-8">
    //               <AvatarImage src="/placeholder.svg" alt={event.character} />
    //               <AvatarFallback>{event.character.charAt(0)}</AvatarFallback>
    //             </Avatar>
    //             <span className="text-sm">{event.character}</span>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <CalendarDays className="h-4 w-4 text-muted-foreground" />
    //             <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
    //           </div>
    //           <Badge variant="outline">{event.campaign}</Badge>
    //         </div>
    //       </CardContent>
    //       <CardFooter>
    //         <Link href={`/dashboard/events/${event.id}`} className="w-full">
    //           <Button variant="outline" className="w-full">
    //             View Event Details
    //             <ChevronRight className="ml-2 h-4 w-4" />
    //           </Button>
    //         </Link>
    //       </CardFooter>
    //     </Card>
    //   ))}
    // </div>
    <CardContent className="p-6">
      <p className="text-center text-muted-foreground">Events feature coming soon!</p>
    </CardContent>
  )
}

