import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Plus, Scroll } from "lucide-react"
import Link from "next/link"
import { CharacterEvents } from "@/components/dashboard/character-events"

export default function CharacterPage({ params }: { params: { id: string } }) {
  // This would normally fetch data from the API
  const character = {
    id: Number.parseInt(params.id),
    name: "Thorne Ironheart",
    description:
      "A stalwart dwarf paladin sworn to the service of Moradin. Thorne hails from the mountain stronghold of Khaz-Modan and seeks to prove his worth to his clan by performing heroic deeds in the wider world.",
    class: "Paladin",
    race: "Dwarf",
    level: 8,
    campaign: "The Forgotten Realms",
    campaignId: 1,
    player: "John Smith",
    playerId: 1,
    events: 12,
    createdAt: "2023-01-20",
    avatar: "/placeholder.svg",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/characters/${params.id}/edit`}>
            <Button variant="outline">Edit Character</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={character.avatar} alt={character.name} />
              <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                {character.race} {character.class}, Level {character.level}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{character.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Player</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={character.player} />
                    <AvatarFallback>{character.player.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{character.player}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Created On</h3>
                <p className="text-sm text-muted-foreground">{new Date(character.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Campaign</h3>
              <div className="flex items-center gap-2 mt-1">
                <Scroll className="h-4 w-4 text-muted-foreground" />
                <Link
                  href={`/dashboard/campaigns/${character.campaignId}`}
                  className="text-sm text-primary hover:underline"
                >
                  {character.campaign}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Character Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">18</span>
                <span className="text-sm text-muted-foreground">Strength</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm text-muted-foreground">Dexterity</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">16</span>
                <span className="text-sm text-muted-foreground">Constitution</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">10</span>
                <span className="text-sm text-muted-foreground">Intelligence</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">14</span>
                <span className="text-sm text-muted-foreground">Wisdom</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">14</span>
                <span className="text-sm text-muted-foreground">Charisma</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-2xl font-bold">{character.events}</span>
              <span className="text-sm text-muted-foreground">Events Recorded</span>
            </div>
            <div className="flex justify-center">
              <Link href={`/dashboard/characters/${params.id}/events/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Event
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Character Events</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Character Events</h2>
            <Link href={`/dashboard/characters/${params.id}/events/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </Link>
          </div>
          <CharacterEvents characterId={character.id} />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Inventory</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Inventory feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Character Notes</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Notes feature coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

