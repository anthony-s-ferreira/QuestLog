"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams, useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getEventTypes } from "@/services/eventTypeService"
import { getRPGById, getRPGCharactersById } from "@/services/rpgService"
import { postEvent } from "@/services/eventService"
import { useToast } from "@/hooks/use-toast"

export default function NewCampaignEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [character, setCharacter] = useState("")
  const [eventType, setEventType] = useState("")
  const [date, setDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const [campaignData, setCampaignData] = useState<any>(null)
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [characters, setCharacters] = useState<any>([])
  const [eventTypes, setEventTypes] = useState<any>([])
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const { toast } = useToast();
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [id])

  const fetchData = async () => {
    const campaignData = await getRPGById(Number(id));
    setCampaignData(campaignData);
    const charactersData = await getRPGCharactersById(Number(id));
    setCharacters(charactersData);
    const eventTypesData = await getEventTypes();
    setEventTypes(eventTypesData);
    setLoading(false);
  };

  const filteredCharacters = characters;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const eventData = {
        description: description,
        characterId: Number(character),
        eventTypeId: Number(eventType),
        date: new Date().toDateString(),
      };
      const response = await postEvent(eventData);
      handleSuccess();
      router.push("/dashboard/campaigns/" + id);
    } catch (error) {
      console.error("Error creating event:", error);
      handleError(error);
    } finally {
      setLoadingSubmit(false);
    }
  }

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: `Event created successfully.`,
      variant: "success"
  })
  }

  const handleError = (error) => {
    toast({
      title: "Error",
      description: error.response?.data?.message,
      variant: "destructive"
    })
  }

  const getLoading = () => {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Record a memorable moment from your campaign: {loading ? getLoading() : campaignData?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="The party faced off against the ancient red dragon Infernus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="character">Character</Label>
                <Select
                  value={character}
                  onValueChange={(val) => {
                    setCharacter(val);
                  }}
                  required
                >
                  <SelectTrigger id="character">
                    <SelectValue placeholder="Select a character" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCharacters.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType || ""} onValueChange={(value) => {
                  setEventType(value);
                }} required>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Creating..." : "Create Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

