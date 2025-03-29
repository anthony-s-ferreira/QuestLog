"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { postRpg } from "@/services/rpgService"

export default function NewCampaignPage() {
  const router = useRouter()
  const { toast } = useToast();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = { name: title, description }
      const rpg = await postRpg(data)
      handleSuccess()
      router.push("/dashboard/campaigns")
    } catch (error) {
      handleError(error)
      
    } finally{
      setIsLoading(false)
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
        description: `Campaign '${title}' created successfully`,
        variant: "success"
    })
 }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Fill in the details for your new tabletop RPG campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                placeholder="The Forgotten Realms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                placeholder="A high fantasy campaign set in the world of Faerûn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

