"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, CalendarDays } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { editRpg, getRPGById } from "@/services/rpgService"
import { useToast } from "@/hooks/use-toast"

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    // nextSession: undefined as Date | undefined,
  })

  const { id } = useParams()

  useEffect(() => {
    try {
      setLoading(true);
      fetchData();
    } catch (error) {
      console.log('Error: ' + error)
    }
  }, [id])

  const fetchData = async () => { 
    const response = await getRPGById(Number(id));
    setCampaign(response);
    setFormData({
      name: response.name,
      description: response.description,
      active: response.active
    })
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, nextSession: date }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await editRpg(Number(id), {name: formData.name, description: formData.description})
      handleSuccess();
      router.push(`/dashboard/campaigns/${id}`)
    } catch (error) {
      handleError(error)
    } finally {
      setIsSaving(false);
    }
  }

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: `Campaign edited successfully.`,
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading campaign data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Update the information for {campaign.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Campaign name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Campaign description and setting"
                rows={5}
              />
            </div>
            {/* <div className="space-y-2">
              <Label>Campaign Status</Label>
              <RadioGroup
                value={formData.active ? "active" : "hiatus"}
                onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hiatus" id="hiatus" />
                  <Label htmlFor="hiatus">Hiatus</Label>
                </div>
              </RadioGroup>
            </div> */}
            {/* <div className="space-y-2">
              <Label>Next Session Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.nextSession && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {formData.nextSession ? format(formData.nextSession, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.nextSession} onSelect={handleDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div> */}
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

