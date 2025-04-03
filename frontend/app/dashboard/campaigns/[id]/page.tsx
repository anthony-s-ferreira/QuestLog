"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, Users } from "lucide-react"
import Link from "next/link"
import { CampaignCharacters } from "@/components/dashboard/campaign-characters"
import { CampaignEvents } from "@/components/dashboard/campaign-events"
import { useEffect, useState } from "react"
import { changeRpgStatus, deleteRpg, getRPGById, getRPGCharactersById, getRPGEventsById } from "@/services/rpgService"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
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

export default function CampaignPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState(null)
  const [players, setPlayers] = useState<number | null>(null)
  const [characters, setCharacters] = useState(null)
  const { id } = useParams()
  const campaignId = parseInt(id as string)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
      try{
        setLoading(true)
        fetchData(campaignId)
      }catch(error){
        console.error('Error:', error);
      }finally {
        
      }
    }, [])
  const fetchData = async (id: number) => {
    const rpg = await getRPGById(id)
    setCampaign(rpg)
    console.log(rpg)
    const events = await getRPGEventsById(id, 1, 10)
    setEvents(events)
    const characters = await getRPGCharactersById(id)
    setCharacters(characters)
    const players = new Set()
    characters.forEach((char) => {
      players.add(char.owner.id)
    })
    setPlayers(players.size)
    setLoading(false)
  }

  const handleChangeStatus = async () => {
    try {
      const response = await changeRpgStatus(id, !campaign.active)
      setCampaign(response)
      setIsDialogOpen(false)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
    
  };

  const confirmDelete = async () => {
    try {
      await deleteRpg(Number(id));
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
      description: `Campaign ${campaign.name} deleted.`,
      variant: "success"
    })
  }

  const getLoading = () => {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div>
  }

  return (
    <div className="flex flex-col gap-6">
      {loading ? <></> : <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of your campaign to {campaign.active ? 'hiatus' : 'active'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeStatus} className="bg-destructive text-destructive-foreground">
              Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{loading ? getLoading() : campaign.name}</h1>
        <div className="flex items-center gap-2">
          {loading ? getLoading() : <Badge variant={campaign.active ? "default" : "secondary"}>{campaign.active ? 'Active' : 'Hiatus'}</Badge>}
            {!loading && campaign.master.id === user.id ? <Button variant="outline"  onClick={() => setIsDialogOpen(true)} disabled={loading}>Change status</Button> : <></>}
          {}
          
          {!loading && (campaign.master.id === user.id || user.type === 'admin') ? 
          <>
            <Link href={`/dashboard/campaigns/${campaignId}/edit`}>
              <Button variant="outline" disabled={loading}>Edit Campaign</Button>
            </Link>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Campaign</Button> 
          </>: <></>}
          
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
              {loading ? getLoading() : <p className="text-muted-foreground">{campaign.description}</p>}
              
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Game Master</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    {loading ? getLoading() : 
                    (
                      <>
                        {/* <AvatarImage src="/placeholder.svg" alt={campaign.master} /> */}
                        <AvatarFallback>{campaign.master.name.charAt(0)}</AvatarFallback>
                      </>
                    )}
                    
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{loading ? getLoading() : campaign.master.name}</span>
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
                <span className="text-2xl font-bold">{loading ? getLoading() : players}</span>
                <span className="text-sm text-muted-foreground">Players</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{loading ? getLoading() : characters.length}</span>
                <span className="text-sm text-muted-foreground">Characters</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-2xl font-bold">{loading ? getLoading() : events.length}</span>
              <span className="text-sm text-muted-foreground">Events Recorded</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="characters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        {loading ? getLoading() : (<>
          <TabsContent value="characters" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Campaign Characters</h2>
          </div>
          <CampaignCharacters characters={characters} />
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Campaign Events</h2>
              <Link href={`/dashboard/campaigns/${campaignId}/events/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </Link>
            </div>
            <CampaignEvents campaignId={campaignId}/>
            </TabsContent>
            </>
        
          )}
        
      </Tabs>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This will permanently delete the campaign "{campaign?.name}". 
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
    
    
  )
}

