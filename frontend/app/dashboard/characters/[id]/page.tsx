"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Plus, Scroll, Trash } from "lucide-react";
import Link from "next/link";
import { CharacterEvents } from "@/components/dashboard/character-events";
import { useEffect, useState } from "react";
import { deleteCharacter, getCharacterById } from "@/services/characterService";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


export default function CharacterPage() {
  const { user } = useAuth();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const characterData = await getCharacterById(Number(id));
        setCharacter(characterData);
      } catch (error) {
        console.error("Error fetching character:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const confirmDelete = async () => {
    try {
      await deleteCharacter(Number(id));
      handleDeleteSuccess()
      router.push("/dashboard")
    } catch {
      
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleDeleteSuccess = () => {
    toast({
      title: "Success",
      description: `Character ${character.name} deleted.`,
      variant: "success"
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-50"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-muted-foreground">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
        <div className="flex items-center gap-2">
        {!loading && (character.owner.id === user.id || user.type === 'admin') ? <>
          <Link href={`/dashboard/characters/${id}/edit`}>
            <Button variant="outline">Edit Character</Button>
          </Link>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash></Trash>
            Delete Character
          </Button> 
        </>
           : <></>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={character.avatar || "/placeholder.svg"} alt={character.name} />
              <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* <div>
              <CardTitle>{character.name}</CardTitle>
              <p className="text-muted-foreground">
                {character.race} {character.class}, Level {character.level}
              </p>
            </div> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{character.description || "No description available."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Player</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt={character.owner?.name || "Unknown"} />
                    <AvatarFallback>{character.owner?.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{character.owner?.name || "Unknown"}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Campaign</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Scroll className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`/dashboard/campaigns/${character.rpg?.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {character.rpg?.name || "Unknown Campaign"}
                  </Link>
                </div>
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
              {["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"].map((stat, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <span className="text-2xl font-bold">{character.stats?.[stat.toLowerCase()] || "?"}</span>
                  <span className="text-sm text-muted-foreground">{stat}</span>
                </div>
              ))}
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
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Events feature coming soon!</p>
            </CardContent>
          </Card>
          {/* <CharacterEvents characterId={character.id} /> */}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This will permanently delete the character "{character?.name}". 
            This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}