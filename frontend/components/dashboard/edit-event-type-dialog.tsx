"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { editEventType } from "@/services/eventTypeService"
import { useToast } from "@/hooks/use-toast"

interface EventType {
  id: string
  name: string
  description: string
  count: number
}

interface EditEventTypeDialogProps {
  eventType: EventType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditEventTypeDialog({ eventType, open, onOpenChange }: EditEventTypeDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();

  useEffect(() => {
    if (eventType) {
      setName(eventType.name)
      setDescription(eventType.description)
    }
  }, [eventType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const eventTypeData = {name: name, description: description}
      const response = await editEventType(Number(eventType.id), eventTypeData);
      handleSuccess();
    } catch(error) {
      console.error('Error: ' + error);
      handleSubmitError(error);
    }finally {
      onOpenChange(false)
      setIsLoading(false)
    }
    
    
  }

  const handleSubmitError = (error: any) => {
    toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive"
      })
  }

  const handleSuccess = () => {
    toast({
        title: "Success",
        description: `Event type edited successfully`,
        variant: "success"
    })
 }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Event Type</DialogTitle>
            <DialogDescription>
              Make changes to the event type. This will affect all events using this type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Event type name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this event type represents..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

