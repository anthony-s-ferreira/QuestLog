import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, Users } from "lucide-react"
import Link from "next/link"
import { CampaignCharacters } from "@/components/dashboard/campaign-characters"
import { CampaignEvents } from "@/components/dashboard/campaign-events"

export default function CampaignPage({ params }: { params: { id: string } }) {
  // This would normally fetch data from the API
  const campaign = {
    id: Number.parseInt(params.id),
    title: "The Forgotten Realms",
    description:
      "A high fantasy campaign set in the world of Faerûn, where brave adventurers face ancient evils and uncover forgotten mysteries. The party has recently arrived in the city of Waterdeep after hearing rumors of strange disappearances in the area.",
    master: "Dungeon Master Dave",
    masterId: 1,
    players: 5,
    characters: 5,
    events: 24,
    lastSession: "2023-12-15",
    nextSession: "2023-12-29",
    status: "active",
    createdAt: "2023-01-15",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
          <Link href={`/dashboard/campaigns/${params.id}/edit`}>
            <Button variant="outline">Edit Campaign</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{campaign.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Game Master</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={campaign.master} />
                    <AvatarFallback>{campaign.master.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{campaign.master}</span>
                </div>
              </div>
              {/* <div>
                <h3 className="font-medium">Created On</h3>
                <p className="text-sm text-muted-foreground">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Last Session</h3>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(campaign.lastSession).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Next Session</h3>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(campaign.nextSession).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{campaign.players}</span>
                <span className="text-sm text-muted-foreground">Players</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{campaign.characters}</span>
                <span className="text-sm text-muted-foreground">Characters</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-2xl font-bold">{campaign.events}</span>
              <span className="text-sm text-muted-foreground">Events Recorded</span>
            </div>
            <div className="flex justify-center">
              <Link href={`/dashboard/campaigns/${params.id}/events/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Event
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="characters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="characters" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Campaign Characters</h2>
            <Link href={`/dashboard/campaigns/${params.id}/characters/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Character
              </Button>
            </Link>
          </div>
          <CampaignCharacters campaignId={campaign.id} />
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Campaign Events</h2>
            <Link href={`/dashboard/campaigns/${params.id}/events/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </Link>
          </div>
          <CampaignEvents campaignId={campaign.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

