import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"


export function CampaignCharacters({ characters }: any) {

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
              <span className="text-sm">{character.owner.name}</span>
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

