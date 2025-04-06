"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { getAllRPGs } from "@/services/adminService"
import { getRPGSelect } from "@/services/rpgService"
import { postCharacter } from "@/services/characterService"
import { useToast } from "@/hooks/use-toast"

export default function NewCharacterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [campaign, setCampaign] = useState("")
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      setIsLoading(true);
      const response = await postCharacter({name: name, rpgId: Number(campaign)});
      handleSuccess();
      setIsLoading(false);
      router.push("/dashboard/characters/" + response.id)

    } catch (error) {
      handleError(error);
      console.error("Error creating character:", error)
    }
  }

  const handleError = (error: any) => {
    toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive"
      })
  }

  const handleSuccess = () => {
    toast({
        title: "Success",
        description: `Character '${name}' created successfully`,
        variant: "success"
    })
 }

  const fetchData = async () => {
    const response = await getRPGSelect();
    setCampaigns(response);
    setLoading(false);
  }


  const getLoading = () => {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-50"></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Character</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>Fill in the details for your new character.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                placeholder="Thorne Ironheart"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="description">Character Description</Label>
              <Textarea
                id="description"
                placeholder="Dwarf Paladin, Level 8..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign</Label>
              {loading ? getLoading() : 
              <Select value={campaign || ""} onValueChange={(value) => {
                setCampaign(value);
              }} required>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              }
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Character"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

