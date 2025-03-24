import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface CampaignCharactersProps {
  campaignId: number
}

export function CampaignCharacters({ campaignId }: CampaignCharactersProps) {
  // This would normally fetch data from the API based on campaignId
  const characters = [
    {
      id: 1,
      name: "Thorne Ironheart",
      description: "Dwarf Paladin, Level 8",
      player: "John Smith",
      playerId: 1,
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Elara Moonwhisper",
      description: "Elf Wizard, Level 8",
      player: "Sarah Johnson",
      playerId: 2,
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Grimm Stonebreaker",
      description: "Dwarf Fighter, Level 7",
      player: "Mike Williams",
      playerId: 3,
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Seraphina Lightbringer",
      description: "Aasimar Cleric, Level 8",
      player: "Emily Davis",
      playerId: 4,
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Zephyr Shadowstep",
      description: "Tiefling Rogue, Level 7",
      player: "Alex Rodriguez",
      playerId: 5,
      avatar: "/placeholder.svg",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {characters.map((character) => (
        <Card key={character.id}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{character.name}</CardTitle>
                <CardDescription>{character.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Player:</span>
              <span className="text-sm">{character.player}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/characters/${character.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Character
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

