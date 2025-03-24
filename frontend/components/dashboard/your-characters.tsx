import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCharacters } from "@/services/characterService"
interface CharacterProps {
  searchQuery: string;
  rpgId?: number;
}
export function YourCharacters({ searchQuery, rpgId }: CharacterProps) {

  const [characters, setCharacters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
        try {
          let characters = await getCharacters();
          if (searchQuery) {
            characters = characters.filter((character) => character.name.toLowerCase().includes(searchQuery.toLowerCase()));
          }
          if (rpgId > 0) {
            characters = characters.filter((character) => character.rpg.id === rpgId);
          }
          setCharacters(characters);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [searchQuery, rpgId]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {loading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div> : characters.map((character) => (
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
              <span className="text-sm text-muted-foreground">Campaign:</span>
              <Badge variant="outline">{character.rpg.name}</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/characters/${character.id}`}>
              <Button variant="outline">
                View Character
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/dashboard/campaigns/${character.rpg.id}`}>
              <Button variant="ghost" size="sm">
                Go to Campaign
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

