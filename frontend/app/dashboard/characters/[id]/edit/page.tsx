"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { editCharacter, getCharacterById } from "@/services/characterService"
import { useToast } from "@/hooks/use-toast"

export default function EditCharacterPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [character, setCharacter] = useState<any>(null)
  const { id } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    // description: "",
    // race: "",
    // class: "",
    // level: "",
    // campaignId: "",
  })



  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [id])

  const fetchData = async () => {
    const characterData = await getCharacterById(Number(id));
    setCharacter(characterData)
    setFormData({
      name: characterData.name,
      // description: characterData.description,
      // race: characterData.race,
      // class: characterData.class,
      // level: characterData.level.toString(),
      // campaignId: characterData.campaignId,
    })
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCampaignChange = (value: string) => {
    setFormData((prev) => ({ ...prev, campaignId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await editCharacter(Number(id), {name: formData.name, rpgId: character.rpgId})
      handleSuccess();
      router.push(`/dashboard/characters/${id}`)
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false)
    }
    
  }


  const handleSuccess = () => {
    toast({
      title: "Success",
      description: `Character edited successfully.`,
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Character</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading character data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Character</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>Update the information for {character.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Character name"
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="description">Character Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Character description and backstory"
                rows={5}
              />
            </div> */}
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="race">Race</Label>
                <Input
                  id="race"
                  name="race"
                  value={formData.race}
                  onChange={handleInputChange}
                  placeholder="Character race"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="Character class"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={handleInputChange}
                  placeholder="Character level"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <Select value={formData.campaignId} onValueChange={handleCampaignChange}>
                  <SelectTrigger id="campaign">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            {/* </div> */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
